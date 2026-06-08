import Corn_Blight_maize from '../assets/Corn_Blight_maize.jpg';
import Corn_Common_Rust_maize from '../assets/Corn_Common_Rust_maize.jpg';
import Corn_Gray_Spot_maize from '../assets/Corn_Gray_Spot_maize.jpg';
import Corn_Health_maize from '../assets/Corn_Health_maize.jpg';

import yellow_rust_wheat from '../assets/yellow_rust_wheat.png';
import mildew_wheat from '../assets/mildew_wheat.png';
import septoria_wheat from '../assets/septoria_wheat.png';
import healthy_wheat from '../assets/healthy_wheat.png';

export const diseaseData = {
  maize: [
    {
      id: 'maize_blight',
      nameEn: 'Blight',
      nameAm: 'ቅጠል ቃጠሎ',
      crop: 'maize',
      severity: 'high',
      descriptionAmharic: 'የበቆሎ ቅጠል ቃጠሎ በፈንገስ የሚከሰትና ቅጠሎችን የሚያቃጥል በሽታ ነው። በዝናባማና ሞቃት አየር ሁኔታ በፍጥነት ይስፋፋል።',
      causesAmharic: 'ኤክስሮሂለም ቱርሲከም (Exserohilum turcicum) የተባለ ፈንገስ የሰብል ተረፈ ምርቶች ላይ ተጠልሎ በመቆየት ይከሰታል።',
      symptomsAmharic: 'በቅጠሎች ላይ ረዣዥም የሲጋራ ቅርፅ ያላቸው ግራጫማ ወይም ቡናማ የደረቁ ጠባሳዎች መታየት።',
      treatmentAmharic: 'ቅጠሎቹ ላይ በሽታው እንደታየ ተስማሚ የፀረ-ፈንገስ መድኃኒት (ለምሳሌ ትሪያዞልስ) ይርጩ። ከተሰበሰበ በኋላ የቀረውን ሰብል ያቃጥሉ ወይም ያርሱ።',
      preventionAmharic: 'በሽታውን የሚቋቋሙ ምርጥ ዘሮችን መዝራት፤ በቆሎን ቢያንስ ለሁለት ዓመት ከባቄላ ወይም ከአተር ጋር ማፈራረቅ።',
      imageUrl: Corn_Blight_maize
    },
    {
      id: 'maize_common_rust',
      nameEn: 'Common Rust',
      nameAm: 'የጋራ ዝገት',
      crop: 'maize',
      severity: 'medium',
      descriptionAmharic: 'የበቆሎ ጋራ ዝገት በቅጠሎች ላይ የዝገት ቀለም ያላቸው ዱቄቶች በመበተን የቅጠሉን የብርሃን አስተገብሮት የሚቀንስ በሽታ ነው።',
      causesAmharic: 'ፑቺኒያ ሶርጊ (Puccinia sorghi) የተባለ የፈንገስ ስፖር በአየር አማካኝነት ተሸክሞ ቅጠል ላይ ሲያርፍ ይከሰታል።',
      symptomsAmharic: 'በቅጠሉ የላይኛውና የታችኛው ክፍል ላይ ቡናማ፣ ዱቄት መሰል አረፋዎች ወይም ነጠብጣቦች መፈጠር።',
      treatmentAmharic: 'መካከለኛ ጉዳት ካለው የኮፐር ፀረ-ፈንገስ መድኃኒቶችን መጠቀም፤ የተበከሉ ቅጠሎችን ቀድሞ ማስወገድ።',
      preventionAmharic: 'ዝገት መቋቋም የሚችሉ ዝርያዎችን መጠቀም፤ ሰብሉን አጥጋግቶ አለመዝራት የአየር ዝውውርን ለመጨመር።',
      imageUrl: Corn_Common_Rust_maize
    },
    {
      id: 'maize_gray_leaf_spot',
      nameEn: 'Gray Leaf Spot',
      nameAm: 'ግራጫ ቅጠል ነጥብ',
      crop: 'maize',
      severity: 'medium',
      descriptionAmharic: 'የበቆሎ ግራጫ ቅጠል ነጥብ በቅጠሎች ደምስር መካከል አራት ማዕዘን ጠባሳዎችን በመፍጠር ቅጠሉ እንዲደርቅ የሚያደርግ በሽታ ነው።',
      causesAmharic: 'ሰርኮስፖራ ዜኤ-ማይዲስ (Cercospora zeae-maydis) የተባለ ፈንገስ በአየር እርጥበት ጊዜ ቅጠሎችን ያጠቃል።',
      symptomsAmharic: 'በደምስሮች የተገደቡ ረዣዥም ግራጫማ ወይም አራት ማዕዘን ቅርፅ ያላቸው ቡናማ ነጠብጣቦች።',
      treatmentAmharic: 'የተክሉን የመከላከል አቅም ለመጨመር የፖታሽ ማዳበሪያ መጨመር፤ በከፋ ሁኔታ የስትሮቢሉሪን ፀረ-ፈንገስ መርጨት።',
      preventionAmharic: 'የሰብል ፈራረቃን መከተል፤ ካለፈው ምርት የተረፉ የበቆሎ አካላትን ሰብስቦ ማቃጠል ወይም በጥልቀት ማረስ።',
      imageUrl: Corn_Gray_Spot_maize
    },
    {
      id: 'maize_healthy',
      nameEn: 'Healthy',
      nameAm: 'ጤናማ',
      crop: 'maize',
      severity: 'none',
      descriptionAmharic: 'ምንም ዓይነት የበሽታ ወይም የጉዳት ምልክት የሌለው፤ እጅግ ጤናማና ንቁ የበቆሎ ተክል።',
      causesAmharic: 'ጥሩ እንክብካቤ፣ ተስማሚ ማዳበሪያ አጠቃቀምና በቂ የውኃ አቅርቦት።',
      symptomsAmharic: 'ለስላሳ፣ ወጥ የሆነ ጥቁር አረንጓዴ ቅጠሎችና ጠንካራ ቀጥ ያለ ግንድ።',
      treatmentAmharic: 'ምንም ዓይነት ሕክምና አያስፈልገውም! እንክብካቤውን ይቀጥሉ፤ አረሞችን በወቅቱ ያፅዱ።',
      preventionAmharic: 'ጥሩ የእርሻ አያያዝን መቀጠል፤ በቂ ማዳበሪያና ውኃ በወቅቱ ማቅረብ።',
      imageUrl: Corn_Health_maize
    }
  ],
  wheat: [
    {
      id: 'wheat_yellow_rust',
      nameEn: 'Yellow Rust',
      nameAm: 'ቢጫ ዝገት',
      crop: 'wheat',
      severity: 'high',
      descriptionAmharic: 'የስንዴ ቢጫ ዝገት በቅጠል ርዝመት ትይዩ የቢጫ መስመሮችን በመፍጠር የስንዴ ፍሬን የሚመታ አደገኛ በሽታ ነው።',
      causesAmharic: 'ፑቺኒያ ስትሪፎርሚስ (Puccinia striiformis) የተባለ ፈንገስ በቀዝቃዛና እርጥብ ደጋማ አየር ሁኔታ ውስጥ ይከሰታል።',
      symptomsAmharic: 'ደማቅ ቢጫ ወይም ብርቱካንማ አረፋዎች በቅጠሉ ርዝመት በትይዩ መስመሮች (Stripes) ተደርድረው መታየት።',
      treatmentAmharic: 'ምልክቱ እንደታየ የስርዓት-ውስጥ ፀረ-ፈንገስ (ትሪያዞልስ) መድኃኒቶችን በፍጥነት ይርጩ።',
      preventionAmharic: 'ለደጋማ አየር ሁኔታ ተስማሚና በሽታውን የሚቋቋሙ ምርጥ ዘሮችን መዝራት፤ ሰብሉን ቀድሞ መዝራት።',
      imageUrl: yellow_rust_wheat
    },
    {
      id: 'wheat_mildew',
      nameEn: 'Mildew',
      nameAm: 'ዱቄት ዝገት',
      crop: 'wheat',
      severity: 'medium',
      descriptionAmharic: 'የስንዴ ዱቄት ዝገት በቅጠሎችና ግንዶች ላይ ነጭ ዱቄት መሰል ፈንገስ በማፍራት ተክሉን የሚያዳክም በሽታ ነው።',
      causesAmharic: 'ብሉሜሪያ ግራሚኒስ (Blumeria graminis) በተባለ ፈንገስ አማካኝነት በጥላና በረጠብ ያለ ከባቢ ይከሰታል።',
      symptomsAmharic: 'በቅጠሎች፣ በግንዶችና በራሶች ላይ ነጭ ወይም አመድማ ዱቄት መሰል ክምችት መፈጠር።',
      treatmentAmharic: 'የናይትሮጅን ማዳበሪያን መጠን መቀነስ፤ ተስማሚ የፀረ-ፈንገስ መድኃኒቶችን መርጨት።',
      preventionAmharic: 'ሰብሉን በሚገባ አራርቆ መዝራት፤ የፀሐይ ብርሃንና አየር በቀላሉ ቅጠሉ ላይ እንዲያርፍ ማድረግ።',
      imageUrl: mildew_wheat
    },
    {
      id: 'wheat_septoria',
      nameEn: 'Septoria',
      nameAm: 'ሴፕቶሪያ',
      crop: 'wheat',
      severity: 'high',
      descriptionAmharic: 'የስንዴ ሴፕቶሪያ ቅጠሎች ላይ ቡናማ ቁስለቶችን በመፍጠር የሰብሉን የፍሬ ዕድገትና መጠን በከፍተኛ ሁኔታ የሚቀንስ በሽታ ነው።',
      causesAmharic: 'ዛይሞሴፕቶሪያ ትሪቲሲ (Zymoseptoria tritici) የተባለ ፈንገስ በዝናብ ጠብታዎች አማካኝነት ከቅጠል ወደ ቅጠል ይዛመታል።',
      symptomsAmharic: 'የስንዴ ቅጠሎች ላይ ሞላላ፣ ግራጫማ ወይም ቡናማ የደረቁ ጠባሳዎች መታየት፤ መካከላቸው ላይ ጥቁር ነጠብጣቦች መኖር።',
      treatmentAmharic: 'በሽታው ገና ሲጀምር የትሪያዞል ፈንገስ መርጫዎችን መጠቀም፤ የተበከሉ ሰብሎችን ማጥፋት።',
      preventionAmharic: 'ከሌሎች ሰብሎች ጋር ማፈራረቅ፤ በጥሩ ፍሳሽ የተዘጋጀ ማሳ መጠቀም።',
      imageUrl: septoria_wheat
    },
    {
      id: 'wheat_healthy',
      nameEn: 'Healthy',
      nameAm: 'ጤናማ',
      crop: 'wheat',
      severity: 'none',
      descriptionAmharic: 'ምንም ዓይነት በሽታ ወይም የዝገት ምልክት የሌለው እጅግ ጤናማ የስንዴ ሰብል።',
      causesAmharic: 'ጥራት ያለው ምርጥ ዘር፣ የተመጣጠነ ማዳበሪያ አጠቃቀምና በቂ እንክብካቤ።',
      symptomsAmharic: 'ቀጥ ያሉ ንጹሕ ቅጠሎችና ሙሉ የወርቅ ፍሬ የያዙ ራሶች (Spikes)።',
      treatmentAmharic: 'ምንም ሕክምና አያስፈልግም! ሰብሉን ከአረሞችና ከወፎች ጥቃት መጠበቅ ይመከራል።',
      preventionAmharic: 'በሽታ መቋቋም የሚችሉ ምርጥ ዘሮችን መዝራት፤ የተመጣጠነ እንክብካቤን መቀጠል።',
      imageUrl: healthy_wheat
    }
  ],
  teff: [
    {
      id: 'teff_rust',
      nameEn: 'Teff Rust (Coming Soon)',
      nameAm: 'የጤፍ ዝገት (በቅርቡ ይመጣል)',
      crop: 'teff',
      severity: 'high',
      descriptionAmharic: 'ይህ የጤፍ በሽታ በሚቀጥለው ስሪት በቅርቡ ይተነተናል።',
      causesAmharic: 'በቅርቡ ይመጣል...',
      symptomsAmharic: 'በቅርቡ ይመጣል...',
      treatmentAmharic: 'በቅርቡ ይመጣል...',
      preventionAmharic: 'በቅርቡ ይመጣል...',
      imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=400'
    }
  ]
};
