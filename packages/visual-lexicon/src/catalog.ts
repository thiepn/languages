/** Original first-party SVG images; each concept is an illustration-specific meaning, not a translated word. */
export interface VisualConcept {
 readonly id:string;
 readonly asset:string;
 readonly alt:string;
 readonly rights:"Original THIEPN illustration";
 readonly origin:{readonly repository:string;readonly revision:string;readonly legacyImageId:string;readonly blobSha:string};
}
export const VISUAL_CONCEPTS:readonly VisualConcept[]=[
  {
    "id": "food.apple",
    "asset": "apple.svg",
    "alt": "Illustration of a red apple",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "apple",
      "blobSha": "26fadf1dfa09ea2160257c5e3681adf1a8754934"
    }
  },
  {
    "id": "beverage.water",
    "asset": "water.svg",
    "alt": "Illustration of a glass of water",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "water",
      "blobSha": "eebaaec38dedc3a57bd143de819fc17e19d4c78f"
    }
  },
  {
    "id": "beverage.green-tea",
    "asset": "tea.svg",
    "alt": "Illustration of a cup of green tea",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "tea",
      "blobSha": "e8a4dbdcecf372d4642c07445c1f88ef69b8a545"
    }
  },
  {
    "id": "object.book",
    "asset": "book.svg",
    "alt": "Illustration of a closed book",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "book",
      "blobSha": "cbb6d7d4f16af1c24a5d20dd053ef9b67e53f20b"
    }
  },
  {
    "id": "vehicle.car",
    "asset": "car.svg",
    "alt": "Illustration of a compact car",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "car",
      "blobSha": "1e6171564d06042762904273c2d1beba55ace019"
    }
  },
  {
    "id": "food.bread",
    "asset": "bread.svg",
    "alt": "Illustration of a loaf and slice of bread",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "bread",
      "blobSha": "13bb4315e920004d051a5b3b865c386a12ba68cd"
    }
  },
  {
    "id": "animal.fish",
    "asset": "fish.svg",
    "alt": "Illustration of a whole fish",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "fish",
      "blobSha": "0c1dd046f2cd2cc6a8d7c157c75c9edb3346f558"
    }
  },
  {
    "id": "beverage.coffee",
    "asset": "coffee.svg",
    "alt": "Illustration of a cup of coffee",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "coffee",
      "blobSha": "f812cb9be7b928e80e2617bda39c53927004fea0"
    }
  },
  {
    "id": "place.house",
    "asset": "house.svg",
    "alt": "Illustration of a small house",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "house",
      "blobSha": "c3035e4257f1f39b7933538d61e61afceaee90ec"
    }
  },
  {
    "id": "place.school",
    "asset": "school.svg",
    "alt": "Illustration of a multistory school with classroom windows and a clock",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "school",
      "blobSha": "a108414c725998dc75af0e9b72f125967769c7f0"
    }
  },
  {
    "id": "place.hospital",
    "asset": "hospital.svg",
    "alt": "Illustration of a hospital building marked with a medical cross",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "hospital",
      "blobSha": "432cfaa6ac8b053bad2994bc1c1fce424eebaf2b"
    }
  },
  {
    "id": "vehicle.train",
    "asset": "train.svg",
    "alt": "Illustration of a passenger train",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "train",
      "blobSha": "6ef6b59b6bec5a088793a6cb13c6addc859a6b1a"
    }
  },
  {
    "id": "action.eat-food",
    "asset": "eat.svg",
    "alt": "Illustration of a person bringing food from a plate to their mouth",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "eat",
      "blobSha": "77595b0ac4ed09d991efe413a73ce5f053c84b1a"
    }
  },
  {
    "id": "action.drink-from-cup",
    "asset": "drink.svg",
    "alt": "Illustration of a person lifting a tilted cup to drink",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "drink",
      "blobSha": "6743239dfdfd349dced6a93596884a5e79b77e4b"
    }
  },
  {
    "id": "gesture.request-quiet",
    "asset": "quiet.svg",
    "alt": "A person holding a finger to their lips in front of an open book",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "quiet",
      "blobSha": "6fc20777026fcd45777e12828582038024c84e65"
    }
  },
  {
    "id": "action.wake-up",
    "asset": "wake-up.svg",
    "alt": "Illustration of a person sitting up and stretching in bed beside a clock",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "wake-up",
      "blobSha": "c3bfd148c2270176efda385030504cf38e741a62"
    }
  },
  {
    "id": "action.board-train",
    "asset": "board.svg",
    "alt": "Illustration of a person moving through a train doorway to board",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "board",
      "blobSha": "780f7c999b01c05de9f16cc23a758267f47ec4f8"
    }
  },
  {
    "id": "action.exit-train",
    "asset": "get-off.svg",
    "alt": "Illustration of a person moving out of a train doorway",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "get-off",
      "blobSha": "4cd2bd3ad6dc3ac361bc47967520048b85c80105"
    }
  },
  {
    "id": "place.retail-shop",
    "asset": "shop.svg",
    "alt": "Illustration of a small shop with a striped awning and merchandise in its window",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "shop",
      "blobSha": "c0acccd97c6b3d162f7e6812742f05a5a3e006cf"
    }
  }
];
