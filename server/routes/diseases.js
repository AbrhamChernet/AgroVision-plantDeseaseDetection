const express = require('express');
const router = express.Router();
const Disease = require('../models/Disease');

// Specific agricultural disease catalog required by the prompt
const seedDiseases = [
  // Maize
  {
    cropType: 'maize',
    nameEnglish: 'Blight',
    nameAmharic: 'ቅጠል ቃጠሎ',
    severity: 'high',
    descriptionAmharic: 'የበቆሎ ቅጠል ቃጠሎ በፈንገስ የሚከሰትና ቅጠሎችን የሚያቃጥል በሽታ ነው።',
    causesAmharic: 'ኤክስሮሂለም ቱርሲከም (Exserohilum turcicum) ፈንገስ።',
    symptomsAmharic: 'ረዣዥም የሲጋራ ቅርፅ ያላቸው ግራጫማ ወይም ቡናማ ጠባሳዎች።',
    treatmentAmharic: 'በቅጠሎቹ ላይ በሽታው እንደታየ ተስማሚ የፀረ-ፈንገስ መድኃኒት ይርጩ።',
    preventionAmharic: 'በሽታውን የሚቋቋሙ ዝርያዎችን መዝራት እና የሰብል ፈራረቃ መከተል።',
    imageUrl: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&q=80&w=400'
  },
  {
    cropType: 'maize',
    nameEnglish: 'Common Rust',
    nameAmharic: 'የጋራ ዝገት',
    severity: 'medium',
    descriptionAmharic: 'የበቆሎ ጋራ ዝገት በቅጠሎች ላይ የዝገት ቀለም ያላቸው ዱቄቶች በመበተን ተክሉን የሚያዳክም ነው።',
    causesAmharic: 'ፑቺኒያ ሶርጊ (Puccinia sorghi) ፈንገስ።',
    symptomsAmharic: 'በቅጠሉ ላይ ቡናማ፣ ዱቄት መሰል አረፋዎች መታየት።',
    treatmentAmharic: 'የኮፐር ፀረ-ፈንገስ መድኃኒቶችን መጠቀም እና የታመሙ ቅጠሎችን ማስወገድ።',
    preventionAmharic: 'በሽታውን የሚቋቋሙ የበቆሎ ዝርያዎችን መጠቀም።',
    imageUrl: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&q=80&w=400'
  },
  {
    cropType: 'maize',
    nameEnglish: 'Gray Leaf Spot',
    nameAmharic: 'ግራጫ ቅጠል ነጥብ',
    severity: 'medium',
    descriptionAmharic: 'በቅጠሎች ደምስር መካከል አራት ማዕዘን ጠባሳዎችን በመፍጠር ቅጠሉ እንዲደርቅ የሚያደርግ በሽታ ነው።',
    causesAmharic: 'ሰርኮስፖራ ዜኤ-ማይዲስ (Cercospora zeae-maydis) ፈንገስ።',
    symptomsAmharic: 'አራት ማዕዘን ቅርፅ ያላቸው ቡናማ ነጠብጣቦች ቅጠሉ ላይ መፈጠር።',
    treatmentAmharic: 'የፖታሽ ማዳበሪያ መጨመር እና በከፋ ሁኔታ ፈንገስ መድኃኒት መርጨት።',
    preventionAmharic: 'የሰብል ፈራረቃን መከተል፤ የሰብል ተረፈ ምርቶችን ማስወገድ።',
    imageUrl: 'https://images.unsplash.com/photo-1473081556163-2a17de81fc97?auto=format&fit=crop&q=80&w=400'
  },
  {
    cropType: 'maize',
    nameEnglish: 'Healthy',
    nameAmharic: 'ጤናማ',
    severity: 'none',
    descriptionAmharic: 'ምንም ዓይነት የበሽታ ወይም የጉዳት ምልክት የሌለው ጤናማ ተክል።',
    causesAmharic: 'ጥሩ እንክብካቤ፣ በቂ ማዳበሪያና ውኃ።',
    symptomsAmharic: 'ጥቁር አረንጓዴ ቅጠሎችና ጠንካራ ቀጥ ያለ ግንድ።',
    treatmentAmharic: 'ምንም ዓይነት ሕክምና አያስፈልገውም! እንክብካቤውን ይቀጥሉ፤ አረሞችን በወቅቱ ያፅዱ።',
    preventionAmharic: 'ጥሩ የእርሻ አያያዝን መቀጠል።',
    imageUrl: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&q=80&w=400'
  },
  
  // Wheat
  {
    cropType: 'wheat',
    nameEnglish: 'Yellow Rust',
    nameAmharic: 'ቢጫ ዝገት',
    severity: 'high',
    descriptionAmharic: 'በቅጠል ርዝመት ትይዩ የቢጫ መስመሮችን በመፍጠር የስንዴ ፍሬን የሚመታ አደገኛ በሽታ ነው።',
    causesAmharic: 'ፑቺኒያ ስትሪፎርሚስ (Puccinia striiformis) ፈንገስ።',
    symptomsAmharic: 'ደማቅ ቢጫ ወይም ብርቱካንማ አረፋዎች በቅጠሉ ርዝመት በትይዩ መስመሮች መታየት።',
    treatmentAmharic: 'ምልክቱ እንደታየ የስርዓት-ውስጥ ፀረ-ፈንገስ መድኃኒቶችን በፍጥነት ይርጩ።',
    preventionAmharic: 'ዝገትን የሚቋቋሙ ምርጥ ዘሮችን መዝራት፤ ሰብሉን ቀድሞ መዝራት።',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400'
  },
  {
    cropType: 'wheat',
    nameEnglish: 'Mildew',
    nameAmharic: 'ዱቄት ዝገት',
    severity: 'medium',
    descriptionAmharic: 'በቅጠሎችና ግንዶች ላይ ነጭ ዱቄት መሰል ፈንገስ በማፍራት ተክሉን የሚያዳክም በሽታ ነው።',
    causesAmharic: 'ብሉሜሪያ ግራሚኒስ (Blumeria graminis) ፈንገስ።',
    symptomsAmharic: 'ነጭ ወይም አመድማ ዱቄት መሰል ክምችት በቅጠሎች ላይ መፈጠር።',
    treatmentAmharic: 'የናይትሮጅን ማዳበሪያን መጠን መቀነስ፤ ተስማሚ የፀረ-ፈንገስ መድኃኒቶችን መርጨት።',
    preventionAmharic: 'ሰብሉን በሚገባ አራርቆ መዝራት የአየር ዝውውርን ለመጨመር።',
    imageUrl: 'https://images.unsplash.com/photo-1536882240095-0379873feb4e?auto=format&fit=crop&q=80&w=400'
  },
  {
    cropType: 'wheat',
    nameEnglish: 'Septoria',
    nameAmharic: 'ሴፕቶሪያ',
    severity: 'high',
    descriptionAmharic: 'ቅጠሎች ላይ ቡናማ ቁስለቶችን በመፍጠር የሰብሉን የፍሬ ዕድገት የሚቀንስ በሽታ ነው።',
    causesAmharic: 'ዛይሞሴፕቶሪያ ትሪቲሲ (Zymoseptoria tritici) ፈንገስ።',
    symptomsAmharic: 'የስንዴ ቅጠሎች ላይ ሞላላ፣ ግራጫማ ወይም ቡናማ የደረቁ ጠባሳዎች መታየት።',
    treatmentAmharic: 'በሽታው ገና ሲጀምር የትሪያዞል ፈንገስ መርጫዎችን መጠቀም።',
    preventionAmharic: 'ከሌሎች ሰብሎች ጋር ማፈራረቅ፤ በጥሩ ፍሳሽ የተዘጋጀ ማሳ መጠቀም።',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400'
  },
  {
    cropType: 'wheat',
    nameEnglish: 'Healthy',
    nameAmharic: 'ጤናማ',
    severity: 'none',
    descriptionAmharic: 'ምንም ዓይነት በሽታ ወይም የዝገት ምልክት የሌለው ጤናማ የስንዴ ሰብል።',
    causesAmharic: 'ጥራት ያለው ምርጥ ዘር፣ የተመጣጠነ ማዳበሪያ አጠቃቀም።',
    symptomsAmharic: 'ቀጥ ያሉ ንጹሕ ቅጠሎችና ሙሉ የስንዴ ፍሬ የያዙ ራሶች።',
    treatmentAmharic: 'ምንም ሕክምና አያስፈልግም! ሰብሉን ከአረሞችና ከወፎች ጥቃት መጠበቅ ይመከራል።',
    preventionAmharic: 'በሽታ መቋቋም የሚችሉ ምርጥ ዘሮችን መዝራት።',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400'
  }
];

// @route   GET api/diseases
// @desc    Get all reference crop diseases, auto-seeding if empty
router.get('/', async (req, res) => {
  try {
    let diseases = await Disease.find();
    
    // Seed DB if completely empty
    if (diseases.length === 0) {
      await Disease.insertMany(seedDiseases);
      diseases = await Disease.find();
    }
    
    res.json({ diseases });
  } catch (err) {
    console.error('Disease fetch error:', err.message);
    res.status(500).json({ message: 'በሽታዎችን ማውጣት አልተቻለም።' });
  }
});

// @route   GET api/diseases/:id
// @desc    Get single disease details by ID
router.get('/:id', async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.id);
    if (!disease) {
      return res.status(404).json({ message: 'የበሽታው ዝርዝር መረጃ አልተገኘም።' });
    }
    res.json({ disease });
  } catch (err) {
    console.error('Single disease fetch error:', err.message);
    res.status(500).json({ message: 'መረጃውን ማውጣት አልተቻለም።' });
  }
});

module.exports = router;
