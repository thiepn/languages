/** Byte-preserved first-party original SVGs. A concept identifies the *depicted* sense, not a translated word. */
export interface VisualConcept {
 readonly id:string;readonly asset:string;readonly alt:string;
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
    "id": "food.cooked-rice-bowl",
    "asset": "rice.svg",
    "alt": "Illustration of a bowl of cooked white rice",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "rice",
      "blobSha": "89667e2f9d55eb8069e06eb814c03303736ee062"
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
    "id": "action.read-book",
    "asset": "read.svg",
    "alt": "Illustration of a person reading",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "read",
      "blobSha": "479eff055d29031ebeac504ad6e47da6d464f2e9"
    }
  },
  {
    "id": "action.write-with-pencil",
    "asset": "write.svg",
    "alt": "Illustration of a pencil writing",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "write",
      "blobSha": "37de3defbea81b780ea6480f7d3e951905f15644"
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
    "id": "place.railway-station",
    "asset": "station.svg",
    "alt": "Illustration of a railway station with a clock and tracks",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "station",
      "blobSha": "650d8b9993effa230f052e204befd91f6d8d452f"
    }
  },
  {
    "id": "object.toilet",
    "asset": "toilet.svg",
    "alt": "Illustration of a toilet",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "toilet",
      "blobSha": "5de3e19701da2007ecea71055878fd8307f3abe4"
    }
  },
  {
    "id": "object.framed-photo",
    "asset": "photo.svg",
    "alt": "Illustration of a framed landscape photograph",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "photo",
      "blobSha": "a319e017e4e51719edcfb12e8227131c9b2343e1"
    }
  },
  {
    "id": "social.family-of-three",
    "asset": "family.svg",
    "alt": "Illustration of a family of three",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "family",
      "blobSha": "dbbeac27430004874cc34475bc3c5c4fc569072c"
    }
  },
  {
    "id": "vehicle.city-bus",
    "asset": "bus.svg",
    "alt": "Illustration of a city bus",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "bus",
      "blobSha": "a9e2e884a8bc8ffcc0079558be522a6b321c80fc"
    }
  },
  {
    "id": "vehicle.bicycle",
    "asset": "bicycle.svg",
    "alt": "Illustration of a bicycle",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "bicycle",
      "blobSha": "a9c52bf9e128f7a04e0ea354284ee746cd86baba"
    }
  },
  {
    "id": "vehicle.airplane",
    "asset": "airplane.svg",
    "alt": "Illustration of an airplane",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "airplane",
      "blobSha": "ecd03f74402a21a6e3bfc70f0c355cf7b1eac98e"
    }
  },
  {
    "id": "vehicle.subway-train",
    "asset": "subway.svg",
    "alt": "Illustration of a subway train in a tunnel",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "subway",
      "blobSha": "bb04525ea42fd118e776c966a97ff4e960897028"
    }
  },
  {
    "id": "food.steak",
    "asset": "meat.svg",
    "alt": "Illustration of a steak on a plate",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "meat",
      "blobSha": "d831339bc68531fe477cbf34f9a7ff9eb81c9eab"
    }
  },
  {
    "id": "food.fresh-vegetables",
    "asset": "vegetables.svg",
    "alt": "Illustration of fresh vegetables",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "vegetables",
      "blobSha": "01488a867ddfb55515af7fa3e70954e9bcf39e14"
    }
  },
  {
    "id": "food.mixed-fruit",
    "asset": "fruit.svg",
    "alt": "Illustration of assorted fruit",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "fruit",
      "blobSha": "6528380fc8feaadd3baa7ad5417e80e18d0ecbff"
    }
  },
  {
    "id": "beverage.juice-glass",
    "asset": "juice.svg",
    "alt": "Illustration of a glass of juice",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "juice",
      "blobSha": "c7962f9eda192e76addf58ac80686cb04eb0c105"
    }
  },
  {
    "id": "place.restaurant",
    "asset": "restaurant.svg",
    "alt": "Illustration of a restaurant with a striped awning and food sign",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "restaurant",
      "blobSha": "2bb6449796a3e84d413265ef9fe618fe27bdadb5"
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
  },
  {
    "id": "food.sushi",
    "asset": "sushi.svg",
    "alt": "Illustration of three pieces of sushi",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "sushi",
      "blobSha": "c30843d1e4787901c53a01b4564bde2f526d4e6b"
    }
  },
  {
    "id": "place.hot-spring",
    "asset": "onsen.svg",
    "alt": "Illustration of steaming hot spring water",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "onsen",
      "blobSha": "f0d32691c7958560471d7b4e4598bb600018198e"
    }
  },
  {
    "id": "weather.rain",
    "asset": "rain.svg",
    "alt": "Illustration of rain falling from a cloud",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "rain",
      "blobSha": "6b2d53717b468eafbc8e743365d274209fdc7004"
    }
  },
  {
    "id": "season.spring-blossoms",
    "asset": "spring.svg",
    "alt": "Illustration of spring blossoms",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "spring",
      "blobSha": "dea38b9165d4c2f6ac7fcee7c5f7e59899ab2fd4"
    }
  },
  {
    "id": "season.summer-beach",
    "asset": "summer.svg",
    "alt": "Illustration of a sunny summer beach",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "summer",
      "blobSha": "9533f63e357faffb760c51989bab092030affde3"
    }
  },
  {
    "id": "season.winter-snow",
    "asset": "winter.svg",
    "alt": "Illustration of a snowy winter landscape",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "winter",
      "blobSha": "c1416bf9e24f65fbe557a15067a233900d608bba"
    }
  },
  {
    "id": "symbol.musical-notes",
    "asset": "music.svg",
    "alt": "Illustration of musical notes",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "music",
      "blobSha": "6595705219ee3206a614bb8def2d960ffa097b50"
    }
  },
  {
    "id": "object.movie-clapperboard",
    "asset": "movie.svg",
    "alt": "Illustration of a movie clapperboard",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "movie",
      "blobSha": "233d7f274bd5ad8f2630186384e229d102f3b73f"
    }
  },
  {
    "id": "object.telephone",
    "asset": "phone.svg",
    "alt": "Illustration of a telephone",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "phone",
      "blobSha": "e41a7b2cef8c128c4ef5ce338f089de6a4f0e57e"
    }
  },
  {
    "id": "object.computer",
    "asset": "computer.svg",
    "alt": "Illustration of a computer",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "computer",
      "blobSha": "7601b2414dead47d64107ce141ca9903e3a706e8"
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
    "id": "object.medicine-and-tablets",
    "asset": "medicine.svg",
    "alt": "Illustration of medicine and tablets",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "medicine",
      "blobSha": "a466daed4cf743f45ea72dbe775ca33afcbca5dd"
    }
  },
  {
    "id": "place.furnished-room",
    "asset": "room.svg",
    "alt": "Illustration of a furnished room",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "room",
      "blobSha": "e0b8f03200d26ac2ebf856623e59a756ffab2ae3"
    }
  },
  {
    "id": "object.handled-bag",
    "asset": "bag.svg",
    "alt": "Illustration of a handled bag",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "bag",
      "blobSha": "325ee8361196852997525941bc1da6983f3c513e"
    }
  },
  {
    "id": "place.hotel",
    "asset": "hotel.svg",
    "alt": "Illustration of a hotel with a labeled entrance",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "hotel",
      "blobSha": "3069b73eaace81b48257f2be5b4ff7d8accdf2f6"
    }
  },
  {
    "id": "object.wallet",
    "asset": "wallet.svg",
    "alt": "Illustration of a wallet",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "wallet",
      "blobSha": "b742e6f684cf67e4085a9f24e59616cc22af9344"
    }
  },
  {
    "id": "place.road",
    "asset": "road.svg",
    "alt": "Illustration of a road",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "road",
      "blobSha": "2200bc259d3280e6a611a466207540fb1fb410a1"
    }
  },
  {
    "id": "object.shopping-bags",
    "asset": "shopping.svg",
    "alt": "Illustration of shopping bags",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "shopping",
      "blobSha": "4f9d5f15e42cf8c9846df07871e243957e8c4dc3"
    }
  },
  {
    "id": "object.photo-camera",
    "asset": "camera.svg",
    "alt": "Illustration of a camera taking a photograph",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "camera",
      "blobSha": "4ec2e375b9e999d0bbe4b3f30257c6ca77f31aee"
    }
  },
  {
    "id": "action.meeting-at-table",
    "asset": "meeting.svg",
    "alt": "Illustration of two people discussing documents across a table",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "meeting",
      "blobSha": "04d4602bf5e61395a144da991a9761b61169cfd8"
    }
  },
  {
    "id": "action.walking-stride",
    "asset": "walk.svg",
    "alt": "Illustration of a person taking a walking stride",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "walk",
      "blobSha": "4de0ed3c8343209ae0222af280be35c84e5f93a3"
    }
  },
  {
    "id": "person.standing",
    "asset": "person.svg",
    "alt": "Illustration of a single person standing",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "person",
      "blobSha": "b67c455529805f230b233e4c63952ae12e0f7da5"
    }
  },
  {
    "id": "person.student-with-book",
    "asset": "student.svg",
    "alt": "Illustration of a student carrying a schoolbook",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "student",
      "blobSha": "14dc2b0419bb55fd2632c6912a5223f951726e50"
    }
  },
  {
    "id": "person.teacher-at-board",
    "asset": "teacher.svg",
    "alt": "Illustration of a teacher pointing at a classroom board",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "teacher",
      "blobSha": "ddcd6ec5d04ef4be9d854ad788994f146bab0009"
    }
  },
  {
    "id": "social.friends-greeting",
    "asset": "friends.svg",
    "alt": "Illustration of two friends greeting each other",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "friends",
      "blobSha": "b4484eb840bb058e1b51adda4578b0af40607598"
    }
  },
  {
    "id": "action.view-picture",
    "asset": "see.svg",
    "alt": "Illustration of a person watching a picture",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "see",
      "blobSha": "70ac591b27814c9be36a9b3fd8064ff22a2d46c1"
    }
  },
  {
    "id": "action.listen-to-speaker",
    "asset": "listen.svg",
    "alt": "Illustration of a person listening to a speaker",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "listen",
      "blobSha": "876dde841bfd06fe4f2f01d51460bc5bedf38eb3"
    }
  },
  {
    "id": "action.walk-away-on-path",
    "asset": "go.svg",
    "alt": "Illustration of a person walking away along a path",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "go",
      "blobSha": "5c5f8bf4394f70c1e03b89254a2b52a4f9b8b382"
    }
  },
  {
    "id": "action.walk-home",
    "asset": "return-home.svg",
    "alt": "Illustration of a person walking home toward a house",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "return-home",
      "blobSha": "82dd7d0cab85a5b5c735a09397a806bab0ff5ff1"
    }
  },
  {
    "id": "action.two-people-talking",
    "asset": "talk.svg",
    "alt": "Illustration of two people talking",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "talk",
      "blobSha": "0bbb5beb599444b1f2f02fc4f34a5086009ae039"
    }
  },
  {
    "id": "relation.larger-box",
    "asset": "big.svg",
    "alt": "Illustration of a large box beside a much smaller box",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "big",
      "blobSha": "44f8a0175b7188fbdd5c231b4833499bb7b0d20e"
    }
  },
  {
    "id": "relation.smaller-box",
    "asset": "small.svg",
    "alt": "Illustration of a small box beside a much larger box",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "small",
      "blobSha": "b4850f5f8ebd4013be2bcc6c9bbcdde0d8a61be9"
    }
  },
  {
    "id": "time.sunrise",
    "asset": "morning.svg",
    "alt": "Illustration of a sunrise over the horizon",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "morning",
      "blobSha": "d7c3e49934cfdf4ae66b42bc4147cb97c778bf97"
    }
  },
  {
    "id": "time.midday-sun",
    "asset": "noon.svg",
    "alt": "Illustration of the sun high above a daytime landscape",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "noon",
      "blobSha": "aefd511e858cd8605fcbb7a30da9366485890cd1"
    }
  },
  {
    "id": "time.moonlit-night",
    "asset": "night.svg",
    "alt": "Illustration of a moon and stars in a night sky",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "night",
      "blobSha": "7c9a3652c5f4184b532836da1a961272e4457b28"
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
    "id": "action.sleep-in-bed",
    "asset": "sleep.svg",
    "alt": "Illustration of a person sleeping in bed",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "sleep",
      "blobSha": "4820f0293f3f02dde7a73f4dc3e8cfaa6d351a63"
    }
  },
  {
    "id": "action.study-at-desk",
    "asset": "study.svg",
    "alt": "Illustration of a learner studying at a desk",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "study",
      "blobSha": "2bc2640537359eaaa018c582bc3b71f908e5bd58"
    }
  },
  {
    "id": "action.office-work",
    "asset": "office-work.svg",
    "alt": "Illustration of a person working at a desk",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "office-work",
      "blobSha": "0397afd1846c232ce9f67bce87573374a057a039"
    }
  },
  {
    "id": "action.rest-on-sofa",
    "asset": "rest.svg",
    "alt": "Illustration of a person reclining on a sofa",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "rest",
      "blobSha": "3961a5fd8226bf1b58916eed0303ad1923accb01"
    }
  },
  {
    "id": "action.shake-hands",
    "asset": "meet.svg",
    "alt": "Illustration of two people meeting and shaking hands",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "meet",
      "blobSha": "8353f6332b0fa96b85dd42f6705f446bf331369d"
    }
  },
  {
    "id": "action.wait-by-clock",
    "asset": "wait.svg",
    "alt": "Illustration of a person waiting by a clock",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "wait",
      "blobSha": "a8e7a58334053747e38371513eca989738fbfbb8"
    }
  },
  {
    "id": "meal.breakfast",
    "asset": "breakfast.svg",
    "alt": "Illustration of a breakfast meal in morning light",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "breakfast",
      "blobSha": "09cfc94adba7fa9e4669a922b5be10496d696117"
    }
  },
  {
    "id": "meal.lunch",
    "asset": "lunch.svg",
    "alt": "Illustration of a lunch meal with the midday sun",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "lunch",
      "blobSha": "7ebcb28d5cb125f3afcda7ae034c78c8798a0f2f"
    }
  },
  {
    "id": "meal.dinner",
    "asset": "dinner.svg",
    "alt": "Illustration of an evening dinner with a crescent moon",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "dinner",
      "blobSha": "422bb3a505e290152b77b9ee835e3536eb163cef"
    }
  },
  {
    "id": "object.yen-price-tag",
    "asset": "price.svg",
    "alt": "Illustration of a price tag with a yen mark",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "price",
      "blobSha": "81aa5fa8f89df94f8d9f2000a07f0d7e0562cbe0"
    }
  },
  {
    "id": "condition.new-shoe",
    "asset": "new.svg",
    "alt": "Illustration of a clean new shoe with a sparkle",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "new",
      "blobSha": "d0911602da81d252914c72b0581636333781e164"
    }
  },
  {
    "id": "condition.worn-shoe",
    "asset": "old.svg",
    "alt": "Illustration of a worn shoe with scuffs and creases",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "old",
      "blobSha": "7bdf99c788090d77b121b9d26ddc667d3287aacd"
    }
  },
  {
    "id": "weather.hot-thermometer",
    "asset": "hot-weather.svg",
    "alt": "Illustration of strong summer sun and a thermometer",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "hot-weather",
      "blobSha": "48b49b10ad235440a6f562733da6d0ada3209ebd"
    }
  },
  {
    "id": "weather.snowy-thermometer",
    "asset": "cold-weather.svg",
    "alt": "Illustration of a snowy thermometer and falling snow",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "cold-weather",
      "blobSha": "3e9578fd933a787093685df021a2acf4081a3ad4"
    }
  },
  {
    "id": "emotion.energetic-person",
    "asset": "energetic.svg",
    "alt": "Illustration of a cheerful person raising both arms",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "energetic",
      "blobSha": "30b1134d98da28b9c51747f74f1b5ad265bc78b6"
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
    "id": "social.parents-with-child",
    "asset": "parents.svg",
    "alt": "Illustration of two parents with a small child",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "parents",
      "blobSha": "9274484a3502e416f7b5ee7cc889e109cac1c7ec"
    }
  },
  {
    "id": "person.office-employee",
    "asset": "employee.svg",
    "alt": "Illustration of an office employee with an ID badge",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "employee",
      "blobSha": "027b998595b936c40be54667519947ff16e1b619"
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
    "id": "direction.arrow-right",
    "asset": "right.svg",
    "alt": "Illustration of a directional arrow pointing right",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "right",
      "blobSha": "9b9fd20959960f1ea4cd81ef63521a3080663184"
    }
  },
  {
    "id": "direction.arrow-left",
    "asset": "left.svg",
    "alt": "Illustration of a directional arrow pointing left",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "left",
      "blobSha": "8f9a54f41696e5b57bd862043a4363835fffdd4d"
    }
  },
  {
    "id": "relation.tree-in-front-of-house",
    "asset": "front.svg",
    "alt": "Illustration of a tree in front of a house",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "front",
      "blobSha": "2df9eaccde001ce004cc29f74809f89d87c22911"
    }
  },
  {
    "id": "relation.tree-behind-house",
    "asset": "behind.svg",
    "alt": "Illustration of a tree behind a house",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "behind",
      "blobSha": "8e50d5c671943e098db22d6a30aa060a83d77743"
    }
  },
  {
    "id": "relation.houses-close-together",
    "asset": "near.svg",
    "alt": "Illustration of two houses close together",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "near",
      "blobSha": "84fe6d1d08ba132ca7e2e7f541f1e34188ec0f6b"
    }
  },
  {
    "id": "relation.houses-far-apart",
    "asset": "far.svg",
    "alt": "Illustration of two houses separated by a long distance",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "far",
      "blobSha": "2dc53904d1ebd4cc9eb9b53dc1bdfe59765a0399"
    }
  },
  {
    "id": "object.travel-luggage-ticket",
    "asset": "travel.svg",
    "alt": "Illustration of travel luggage and an airplane ticket",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "travel",
      "blobSha": "e8880c284cde16bf34247c1af0d8a7002c570859"
    }
  },
  {
    "id": "object.booking-calendar",
    "asset": "reservation.svg",
    "alt": "Illustration of a confirmed booking in a calendar",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "reservation",
      "blobSha": "473d5b0e46f65c811d0bdcd2f00ba36df2b05e11"
    }
  },
  {
    "id": "action.stirring-pot",
    "asset": "cooking.svg",
    "alt": "Illustration of a cook stirring a pot",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "cooking",
      "blobSha": "2298036d304261a10188beb271877cc4b711f588"
    }
  },
  {
    "id": "object.email-envelope",
    "asset": "email.svg",
    "alt": "Illustration of an electronic mail envelope",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "email",
      "blobSha": "9392d000eedabc1b2cf487d040a03c5e72481f58"
    }
  },
  {
    "id": "place.town-buildings",
    "asset": "town.svg",
    "alt": "Illustration of a row of town buildings",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "town",
      "blobSha": "425e39628a22e42e0d3cd4d21bc81929d2dc4ce4"
    }
  },
  {
    "id": "beverage.assorted-glasses",
    "asset": "beverage.svg",
    "alt": "Illustration of different beverages in glasses",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "beverage",
      "blobSha": "b18106c39ea0e450176705834cd54d1dfcdf9c8e"
    }
  },
  {
    "id": "script.japanese-kanji-examples",
    "asset": "kanji.svg",
    "alt": "Illustration of three example Japanese kanji characters",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "kanji",
      "blobSha": "55c83760f3531e2b8bb2f47b432f5122364e59dc"
    }
  },
  {
    "id": "object.phone-apps",
    "asset": "app.svg",
    "alt": "Illustration of a smartphone with application icons",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "app",
      "blobSha": "5da5a592689fd4ce851c89f76de4af4b39f2d32b"
    }
  },
  {
    "id": "action.sit-on-chair",
    "asset": "sit.svg",
    "alt": "Illustration of a person sitting on a chair",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "sit",
      "blobSha": "8ea3d2fdbeea2d33c4884c69d74c15f882d57048"
    }
  },
  {
    "id": "action.enter-doorway",
    "asset": "enter.svg",
    "alt": "Illustration of a person entering a doorway",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "enter",
      "blobSha": "6f6d85088cc4d07cf2bcc76c1d852d8ba4546d9d"
    }
  },
  {
    "id": "action.practice-written-characters",
    "asset": "practice.svg",
    "alt": "Illustration of a learner practicing written characters",
    "rights": "Original THIEPN illustration",
    "origin": {
      "repository": "thiepn/japanese",
      "revision": "0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458",
      "legacyImageId": "practice",
      "blobSha": "167bb64f8784a8a3f00257eed1a72dc2bd91b5ec"
    }
  }
];
