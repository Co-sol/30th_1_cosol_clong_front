import badge1 from "./../assets/badge1.png";
import badge2 from "./../assets/badge2.png";
import badge3 from "./../assets/badge3.png";
import badge4 from "./../assets/badge4.png";
import badge5 from "./../assets/badge5.png";

// 뱃지 이미지 가져오는 함수
export function getBadgeImage(badgeId) {
    switch (badgeId) {
        case 0:
            return badge1;
        case 1:
            return badge2;
        case 2:
            return badge3;
        case 3:
            return badge4;
        case 4:
            return badge5;
    }
}
