import React, { useMemo, useRef, useState } from 'react';
import { Image, Modal, PanResponder, Pressable, Text, TextInput, View } from 'react-native';
import { colors, fonts, inkAlpha, radii, shadows, skyAlpha } from '../theme';
import Card from './Card';

export const MIN_CLIP_SEC = 3;

const TRACK_HEIGHT = 104;
// Touches this close to a selection edge grab that handle instead of sliding.
const EDGE_GRAB_PX = 26;
// Visible grip drawn at each selection edge (the grab zone stays EDGE_GRAB_PX wide).
const GRIP_WIDTH = 14;

export function formatTime(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function formatClipLength(sec: number): string {
  return sec < 60 ? `${sec.toFixed(1)}s` : formatTime(sec);
}

/** Accepts "1:23", "01:23" or plain seconds like "83". Null if unreadable. */
function parseTimeInput(text: string): number | null {
  const t = text.trim();
  const asClock = t.match(/^(\d+):(\d{1,2})$/);
  if (asClock) return parseInt(asClock[1], 10) * 60 + parseInt(asClock[2], 10);
  const asSeconds = Number(t.replace(',', '.'));
  return t !== '' && Number.isFinite(asSeconds) && asSeconds >= 0 ? asSeconds : null;
}

interface Props {
  durationSec: number;
  waveformUri: string | null;
  songName: string;
  start: number;
  end: number;
  onWindowChange: (start: number, end: number) => void;
  playheadSec: number | null;
}

/** Deterministic pseudo-waveform used until (or if) FFmpeg renders the real one. */
function fallbackBars(seed: string, count: number): number[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  }
  const bars: number[] = [];
  for (let i = 0; i < count; i++) {
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    const r = ((h >>> 0) % 1000) / 1000;
    bars.push(0.25 + 0.7 * Math.abs(Math.sin(i * 0.7)) * (0.4 + 0.6 * r));
  }
  return bars;
}

export default function WaveTrimmer({
  durationSec,
  waveformUri,
  songName,
  start,
  end,
  onWindowChange,
  playheadSec,
}: Props) {
  const [width, setWidth] = useState(0);
  const [editing, setEditing] = useState<'start' | 'end' | null>(null);
  const [draft, setDraft] = useState('');

  // Live values for the pan responder (created once, so no stale closures).
  const live = useRef({ start, end, width, durationSec, onWindowChange, base: { start: 0, end: 0 } });
  live.current.start = start;
  live.current.end = end;
  live.current.width = width;
  live.current.durationSec = durationSec;
  live.current.onWindowChange = onWindowChange;

  const bars = useMemo(() => fallbackBars(songName, 52), [songName]);

  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

  // One responder over the whole track. The mode is picked from where the
  // touch lands, so a narrow selection can still be trimmed, moved, or jumped
  // without three overlapping gesture targets fighting over the finger.
  const mode = useRef<'left' | 'right' | 'slide'>('slide');
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { start: s0, end: e0, width: w, durationSec: dur } = live.current;
        if (w <= 0 || dur <= 0) return;
        const pps = w / dur;
        const x = evt.nativeEvent.locationX;
        const x1 = s0 * pps;
        const x2 = e0 * pps;
        const dLeft = Math.abs(x - x1);
        const dRight = Math.abs(x - x2);
        if (Math.min(dLeft, dRight) <= EDGE_GRAB_PX) {
          mode.current = dLeft <= dRight ? 'left' : 'right';
          live.current.base = { start: s0, end: e0 };
        } else if (x > x1 && x < x2) {
          mode.current = 'slide';
          live.current.base = { start: s0, end: e0 };
        } else {
          // Touch outside the selection: jump the window there, then slide.
          mode.current = 'slide';
          const len = e0 - s0;
          const s = clamp(x / pps - len / 2, 0, dur - len);
          live.current.base = { start: s, end: s + len };
          live.current.onWindowChange(s, s + len);
        }
      },
      onPanResponderMove: (_evt, gesture) => {
        const { base, durationSec: dur, width: w } = live.current;
        if (w <= 0 || dur <= 0) return;
        const dSec = (gesture.dx / w) * dur;
        const minLen = Math.min(MIN_CLIP_SEC, dur);
        if (mode.current === 'left') {
          const s = clamp(base.start + dSec, 0, base.end - minLen);
          live.current.onWindowChange(s, base.end);
        } else if (mode.current === 'right') {
          const e = clamp(base.end + dSec, base.start + minLen, dur);
          live.current.onWindowChange(base.start, e);
        } else {
          const len = base.end - base.start;
          const s = clamp(base.start + dSec, 0, dur - len);
          live.current.onWindowChange(s, s + len);
        }
      },
    }),
  ).current;

  const beginEdit = (edge: 'start' | 'end') => {
    setDraft(formatTime(edge === 'start' ? start : end));
    setEditing(edge);
  };

  // Typed times are clamped into the valid range instead of rejected: the
  // start can go up to 3s before the end, the end up to the song's length.
  const commitEdit = () => {
    if (!editing) return;
    const parsed = parseTimeInput(draft);
    if (parsed !== null && durationSec > 0) {
      const minLen = Math.min(MIN_CLIP_SEC, durationSec);
      if (editing === 'start') {
        onWindowChange(clamp(parsed, 0, end - minLen), end);
      } else {
        onWindowChange(start, clamp(parsed, start + minLen, durationSec));
      }
    }
    setEditing(null);
  };

  const pps = durationSec > 0 && width > 0 ? width / durationSec : 0;
  const x1 = start * pps;
  const x2 = end * pps;

  const timeField = (edge: 'start' | 'end') => (
    <Pressable onPress={() => beginEdit(edge)} hitSlop={10}>
      <Text
        style={{
          fontFamily: fonts.label,
          fontSize: 13,
          color: colors.smoke,
          borderBottomWidth: 1,
          borderStyle: 'dashed',
          borderColor: colors.steel,
        }}
      >
        {formatTime(edge === 'start' ? start : end)}
      </Text>
    </Pressable>
  );

  const minLen = Math.min(MIN_CLIP_SEC, durationSec);
  const editMin = editing === 'end' ? start + minLen : 0;
  const editMax = editing === 'end' ? durationSec : end - minLen;

  // The full-track waveform, drawn twice: faded across the whole track, and
  // again in full ink inside the selection card.
  const wave = waveformUri ? (
    <View style={{ position: 'absolute', top: 6, bottom: 6, left: 0, right: 0 }}>
      <Image
        source={{ uri: `file://${waveformUri}` }}
        style={{ flex: 1, width: undefined, height: undefined }}
        resizeMode="stretch"
      />
    </View>
  ) : (
    <View
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 4,
        right: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
      }}
    >
      {bars.map((b, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: b * (TRACK_HEIGHT - 34),
            borderRadius: 3,
            backgroundColor: colors.ink,
          }}
        />
      ))}
    </View>
  );

  return (
    <View>
      {/* Track — the only touch target; children are draw-only */}
      <View
        {...pan.panHandlers}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        style={{
          height: TRACK_HEIGHT,
          borderRadius: radii.control,
          backgroundColor: skyAlpha(0.75),
        }}
      >
        {/* Whole song, faded into the sky */}
        <View pointerEvents="none" style={{ position: 'absolute', inset: 0, opacity: 0.35 }}>
          {wave}
        </View>

        {/* Selection — a white card that owns its background, border and
            corners, so no rounding depends on the parent clipping children
            (Android only clips to the rectangle). */}
        <View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: x1,
              width: Math.max(0, x2 - x1),
              backgroundColor: colors.white,
              borderWidth: 2,
              borderColor: colors.ink,
              borderRadius: radii.control,
            },
            shadows.control,
          ]}
        >
          <View style={{ flex: 1, borderRadius: radii.control - 2, overflow: 'hidden' }}>
            {/* Track-sized clone shifted left so the slice lines up exactly
                (the -2s compensate for the card border). */}
            <View style={{ position: 'absolute', left: -x1 - 2, top: -2, width, height: TRACK_HEIGHT }}>
              {wave}
            </View>
          </View>
        </View>

        {/* Playhead */}
        {playheadSec !== null && pps > 0 && (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 4,
              bottom: 4,
              left: clamp(playheadSec * pps, 0, Math.max(0, width - 2)),
              width: 2,
              borderRadius: 1,
              backgroundColor: colors.smoke,
            }}
          />
        )}

        {/* Edge grips — white so they read over the ink waveform */}
        {(['left', 'right'] as const).map((edge) => {
          const x = edge === 'left' ? x1 - GRIP_WIDTH / 2 : x2 - GRIP_WIDTH / 2;
          return (
            <View
              key={edge}
              pointerEvents="none"
              style={[
                {
                  position: 'absolute',
                  top: 26,
                  bottom: 26,
                  left: clamp(x, -GRIP_WIDTH / 2, Math.max(0, width - GRIP_WIDTH / 2)),
                  width: GRIP_WIDTH,
                  borderRadius: GRIP_WIDTH / 2,
                  backgroundColor: colors.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                shadows.control,
              ]}
            >
              <View style={{ width: 2.5, height: 18, borderRadius: 1.5, backgroundColor: colors.ink }} />
            </View>
          );
        })}
      </View>

      {/* Time labels — tap one to type an exact time */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
        {timeField('start')}
        <View
          style={{
            backgroundColor: colors.mist,
            borderRadius: radii.pill,
            paddingHorizontal: 12,
            paddingVertical: 4,
          }}
        >
          <Text style={{ fontFamily: fonts.label, fontSize: 13, color: colors.ink }}>
            {formatClipLength(end - start)} selected
          </Text>
        </View>
        {timeField('end')}
      </View>

      {/* Type-a-time modal — sits high so the keyboard never covers it */}
      <Modal visible={editing !== null} transparent animationType="fade" onRequestClose={() => setEditing(null)}>
        <Pressable
          style={{ flex: 1, backgroundColor: inkAlpha(0.4), alignItems: 'center', paddingTop: 110 }}
          onPress={() => setEditing(null)}
        >
          <Pressable onPress={() => {}}>
            <Card>
              <View style={{ padding: 24, width: 260, alignItems: 'center', gap: 14 }}>
                <Text style={{ fontFamily: fonts.display, fontSize: 20, color: colors.ink }}>
                  {editing === 'end' ? 'End at' : 'Start at'}
                </Text>
                <TextInput
                  value={draft}
                  onChangeText={setDraft}
                  onSubmitEditing={commitEdit}
                  autoFocus
                  selectTextOnFocus
                  returnKeyType="done"
                  style={{
                    fontFamily: fonts.display,
                    fontSize: 32,
                    color: colors.ink,
                    textAlign: 'center',
                    minWidth: 130,
                    paddingVertical: 4,
                    borderBottomWidth: 2,
                    borderColor: colors.ink,
                  }}
                />
                <Text style={{ fontFamily: fonts.body, fontSize: 13, color: colors.smoke }}>
                  between {formatTime(editMin)} and {formatTime(editMax)}
                </Text>
                <Pressable
                  onPress={commitEdit}
                  style={({ pressed }) => ({
                    alignSelf: 'stretch',
                    backgroundColor: colors.ink,
                    borderRadius: radii.pill,
                    paddingVertical: 12,
                    alignItems: 'center',
                    opacity: pressed ? 0.85 : 1,
                  })}
                >
                  <Text style={{ fontFamily: fonts.label, fontSize: 15, color: colors.sky }}>Done</Text>
                </Pressable>
              </View>
            </Card>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
