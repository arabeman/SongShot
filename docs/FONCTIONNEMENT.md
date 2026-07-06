# SongShot — Comment fonctionne l'application

SongShot est une app mobile (React Native 0.85, TypeScript) qui transforme **une photo + un extrait de chanson** en une **vidéo MP4** prête à partager. L'utilisateur choisit une image, un fichier audio de son téléphone, découpe le passage qu'il veut (le refrain, le drop…), et l'app mixe le tout en vidéo localement, sans serveur : tout se passe sur l'appareil grâce à FFmpeg embarqué.

## Le parcours utilisateur

Le flux principal est un enchaînement de 3 étapes (matérialisé à l'écran par le composant `StepMeter`) :

```
Home ──► PickImage ──► PickSong ──► Trim ──► Result
 ▲          (1)           (2)        (3)       │
 └─────────────── retour au feed ──────────────┘
```

1. **Home** (`src/screens/HomeScreen.tsx`) — le « feed » : la liste des créations passées, un bouton flottant (FAB) pour en lancer une nouvelle, et un lien vers l'écran Support. Si le feed est vide, un état d'accueil animé fait défiler des mots (« chorus », « beat drop »…) via le hook `useCycleWord`.
2. **PickImage** (`PickImageScreen.tsx`) — choix d'une photo dans la galerie via `react-native-image-picker`.
3. **PickSong** (`PickSongScreen.tsx`) — choix d'un fichier audio (MP3, M4A, WAV…) via `@react-native-documents/picker`. Point important : le fichier est **copié hors du sandbox SAF** (`keepLocalCopy` vers le cache) pour que FFmpeg et le lecteur reçoivent un vrai chemin de fichier. La durée est ensuite lue avec FFprobe (`probeDurationSec`).
4. **Trim** (`TrimScreen.tsx`) — le cœur de l'app : on choisit le passage de la chanson (fenêtre de 3 s minimum, 15 s par défaut), on pré-écoute, puis on lance l'export.
5. **Result** (`ResultScreen.tsx`) — lecture en boucle de la vidéo produite, avec « Enregistrer dans la galerie » (CameraRoll, album « SongShot ») et « Partager » (feuille de partage système).

Après un export réussi, la pile de navigation est **réinitialisée** en `[Home, Result]` (`navigation.reset`) : le bouton retour ramène au feed, jamais au tunnel de création.

## L'écran Trim en détail

- **Forme d'onde** : FFmpeg génère un PNG transparent de la waveform (`renderWaveformPng`, filtre `showwavespic`) affiché dans le bandeau de découpe. Si le filtre échoue, `WaveTrimmer` affiche une pseudo-waveform déterministe calculée à partir du nom du fichier (`fallbackBars`).
- **Découpe** : `WaveTrimmer` (`src/components/WaveTrimmer.tsx`) gère les gestes avec `PanResponder` — tirer un bord redimensionne la fenêtre (zone de saisie de 26 px), tirer le milieu la déplace. On peut aussi saisir un temps au clavier (« 1:23 » ou « 83 »).
- **Pré-écoute** : un composant `<Video>` invisible (0×0) de `react-native-video` joue la chanson ; quand la tête de lecture dépasse la fin de la fenêtre, on re-seek au début (boucle). Un `useFocusEffect` coupe la lecture dès que l'écran perd le focus.
- **Export** : un overlay plein écran affiche la progression sous forme de barres d'onde qui se remplissent d'encre (`WaveProgress`), alimentée par les statistiques FFmpeg.

## Le pipeline média (`src/lib/media.ts`)

L'export (`exportCreationVideo`) construit une commande FFmpeg qui :

1. boucle sur l'image fixe (`-loop 1`) comme piste vidéo ;
2. prend le segment audio choisi (`-ss début -t durée`) ;
3. redimensionne à 1080 px de large max, en forçant des **dimensions paires** (requis par `yuv420p`) ;
4. encode à 30 fps, audio AAC 192k, avec `-movflags +faststart` pour une lecture en streaming.

Côté codec vidéo, l'app tente d'abord l'**encodeur matériel H.264** (`h264_mediacodec`). S'il échoue, elle retombe sur l'encodeur logiciel `mpeg4` : le build FFmpeg embarqué (`@wokcito/ffmpeg-kit-react-native`) n'inclut pas libx264 (licence GPL).

## Persistance (`src/lib/creations.ts`)

Pas de base de données : les métadonnées des créations (id UUID, chemins, nom de la chanson, fenêtre de découpe, date) sont un tableau JSON dans **AsyncStorage** (clé `songshot_creations`). Les fichiers (copie de la photo + MP4) vivent dans `Documents/creations/`. La suppression retire l'entrée du JSON puis efface les fichiers en best-effort.

## Partage (`src/lib/share.ts`)

Subtilité Android : le FileProvider de `react-native-share` n'expose que le dossier Download et le cache de l'app. Une vidéo stockée sous `DocumentDirectoryPath` est donc **copiée dans le cache** avant d'ouvrir la feuille de partage, sinon l'intent ne résout pas le fichier.

## Structure du code

```
src/
├── App.tsx              # Navigation (stack natif, 6 écrans, header masqué)
├── theme.ts             # Design system : couleurs, polices, rayons, ombres
├── screens/             # Un fichier par écran (Home, PickImage, PickSong, Trim, Result, Support)
├── components/          # UI réutilisable : Card, BigButton, IconButton, ScreenHeader,
│                        #   StepMeter, WaveMark (le logo), WaveTrimmer, CreationCard, icons
├── lib/                 # Logique : media (FFmpeg), creations (persistance),
│                        #   share, links (Play Store / Patreon), haptics, useCycleWord
└── types/navigation.ts  # RootStackParamList (params typés entre écrans)
```

## Le design system (`src/theme.ts`)

L'identité visuelle « air studio » : tout flotte sur un fond ciel, sans contours.

- **Couleurs** : des couches tonales — `sky` (fond, `#C9E3F5`), `mist`, `steel`, `smoke`, `ink` (texte et action principale, `#3C464B`), blanc. Les voiles utilisent `inkAlpha()` / `skyAlpha()` plutôt que du noir/blanc.
- **Polices** : Bricolage Grotesque pour le wordmark et les titres, Nunito pour labels et texte courant (fichiers dans `assets/fonts/`).
- **Ombres** : teintées d'encre, douces (`shadows.card` / `shadows.control`) — c'est l'élévation qui structure, pas les bordures.
- **Le logo** : `WaveMark`, cinq barres de son arrondies (hauteurs `[0.38, 0.72, 1, 0.55, 0.82]`). Il sert de glyphe de marque partout : header, états vides, icône de l'app.

## Dépendances natives clés

| Paquet | Rôle |
|---|---|
| `@wokcito/ffmpeg-kit-react-native` | Encodage vidéo, waveform, probe de durée |
| `react-native-video` | Pré-écoute audio et lecture du résultat |
| `react-native-image-picker` | Sélection de la photo |
| `@react-native-documents/picker` | Sélection du fichier audio (avec copie locale) |
| `@react-native-camera-roll/camera-roll` | Enregistrement dans la galerie |
| `react-native-share` | Feuille de partage système |
| `@dr.pogodin/react-native-fs` | Fichiers (copies, dossier creations, cache) |
| `@react-native-async-storage/async-storage` | Métadonnées des créations |
| `react-native-haptic-feedback` | Retours haptiques (FAB, export réussi) |

## À savoir avant de publier

`src/lib/links.ts` contient encore des placeholders : l'`applicationId` Play Store (`com.rn`) et l'URL Patreon sont à remplacer avant mise en production.
