const techFacts = [
  {
    year: "1826",
    title: "First Photograph Ever Taken",
    fact: "Joseph Nicéphore Niépce captured the first known photograph, 'View from the Window at Le Gras', using a process called heliography. The exposure took approximately 8 hours.",
    category: "Photography"
  },
  {
    year: "1936",
    title: "The Birth of the Pixel",
    fact: "Frederic Eugene Ives first described the concept of dividing an image into a grid of discrete elements. This idea would later evolve into what we now call pixels.",
    category: "Imaging"
  },
  {
    year: "1957",
    title: "First Digital Image",
    fact: "Russell Kirsch created the first digital image by scanning a photograph of his infant son. The image was 176×176 pixels and is now a national treasure.",
    category: "Digital Imaging"
  },
  {
    year: "1969",
    title: "CCD Sensor Invented",
    fact: "Willard Boyle and George Smith at Bell Labs invented the charge-coupled device (CCD), which became the foundation for digital cameras and earned them a Nobel Prize in 2009.",
    category: "Hardware"
  },
  {
    year: "1972",
    title: "First Digital Color Photo",
    fact: "The first digital color photograph was produced using early scanning technology. It took minutes to process what modern cameras do in milliseconds.",
    category: "Photography"
  },
  {
    year: "1975",
    title: "First Digital Camera",
    fact: "Steve Sasson at Kodak built the first self-contained digital camera. It weighed 8 pounds, captured a 0.01 megapixel image, and took 23 seconds to record to cassette tape.",
    category: "Hardware"
  },
  {
    year: "1987",
    title: "Photoshop Development Begins",
    fact: "Thomas Knoll wrote the first version of Photoshop, originally called 'Display'. His brother John joined and they sold the distribution license to Adobe in 1988.",
    category: "Software"
  },
  {
    year: "1992",
    title: "JPEG Standard Released",
    fact: "The Joint Photographic Experts Group published the JPEG compression standard, revolutionizing how images are stored and transmitted. It reduced file sizes by up to 90%.",
    category: "Standards"
  },
  {
    year: "1995",
    title: "PNG Format Created",
    fact: "PNG was developed as a patent-free alternative to GIF. It supports lossless compression and transparency — the same alpha channel that makes background removal possible.",
    category: "Standards"
  },
  {
    year: "1999",
    title: "First Camera Phone",
    fact: "The Kyocera VP-210 became the first commercially available camera phone in Japan. It had a 0.11 megapixel camera. Today's phones exceed 200 megapixels.",
    category: "Mobile"
  },
  {
    year: "2001",
    title: "Image Matting Advances",
    fact: "Researchers at Microsoft published the 'Bayesian Matting' paper, one of the first algorithms to accurately separate foreground from background in natural images.",
    category: "AI"
  },
  {
    year: "2009",
    title: "ImageNet Dataset Launched",
    fact: "Fei-Fei Li and her team released ImageNet with 14 million labeled images across 20,000 categories. It became the benchmark that drove the deep learning revolution in computer vision.",
    category: "AI"
  },
  {
    year: "2012",
    title: "Deep Learning Breakthrough",
    fact: "AlexNet won the ImageNet challenge by a massive margin using deep convolutional neural networks. This moment is widely considered the start of the modern AI era.",
    category: "AI"
  },
  {
    year: "2015",
    title: "U-Net for Image Segmentation",
    fact: "The U-Net architecture was published, enabling precise pixel-level image segmentation. Variants of this architecture power most modern background removal tools, including this one.",
    category: "AI"
  },
  {
    year: "2017",
    title: "Transformers Architecture",
    fact: "Google published 'Attention Is All You Need', introducing the transformer model. Originally for text, it now powers vision models that understand image content at remarkable levels.",
    category: "AI"
  },
  {
    year: "2020",
    title: "WebAssembly + AI in Browser",
    fact: "Advances in WebAssembly and ONNX Runtime made it possible to run neural networks directly in the browser — no server needed. Your images never leave your device.",
    category: "Web"
  },
  {
    year: "2023",
    title: "Segment Anything Model",
    fact: "Meta released SAM (Segment Anything Model), trained on 11 million images and 1.1 billion masks. It can identify and separate any object in any image with zero additional training.",
    category: "AI"
  },
  {
    year: "1839",
    title: "Daguerreotype Process",
    fact: "Louis Daguerre publicly announced the daguerreotype, the first commercially practical photographic process. Exposure times were 3-15 minutes — subjects had to stay perfectly still.",
    category: "Photography"
  },
  {
    year: "2010",
    title: "Instagram Launches",
    fact: "Instagram launched with just 13 employees and gained 25,000 users on day one. It normalized photo editing for billions and sparked the era of visual-first communication.",
    category: "Social"
  },
  {
    year: "1985",
    title: "First Desktop Publishing",
    fact: "Aldus PageMaker launched alongside the Apple LaserWriter, creating the desktop publishing revolution. For the first time, anyone could combine text and images professionally.",
    category: "Software"
  }
];

export function getRandomFact(excludeIndex = -1) {
  let index;
  do {
    index = Math.floor(Math.random() * techFacts.length);
  } while (index === excludeIndex && techFacts.length > 1);
  return { ...techFacts[index], index };
}

export default techFacts;
