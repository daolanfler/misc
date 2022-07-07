interface Speaker {
  playSound(): void;
}

interface VolumeControl {
  volumeUp(): void;
  volumeDown(): void;
}

interface ISpeakerWithVolumeControl extends Speaker, VolumeControl {}

type ISpeakerWithVolumeControl2 = Speaker & VolumeControl;

type ISpeakerWithVolumeControl3 = Speaker | VolumeControl;

type test = ISpeakerWithVolumeControl extends ISpeakerWithVolumeControl2
  ? true
  : false;

type test2 = ISpeakerWithVolumeControl3 extends ISpeakerWithVolumeControl2
  ? true
  : false;

const device: ISpeakerWithVolumeControl3 = {
  playSound() {
    //
  },
  volumeDown() {
    // 
  },
};
