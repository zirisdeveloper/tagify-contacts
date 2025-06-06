
export interface Contact {
  id: string;
  name: string;
  familyName?: string;
  phoneNumber?: string;
  phoneNumber2?: string;
  tags: Tag[];
}

export interface Tag {
  id: string;
  name: string;
}

// Add Web Speech API typings
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
