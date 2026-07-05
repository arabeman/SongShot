export type RootStackParamList = {
  Home: undefined;
  PickImage: undefined;
  PickSong: { imageUri: string };
  Trim: {
    imageUri: string;
    songUri: string;
    songName: string;
    songDuration: number | null;
  };
  Result: { creationId: string };
  Support: undefined;
};
