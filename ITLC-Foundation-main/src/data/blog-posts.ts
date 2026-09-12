export interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  author: string;
  authorRole?: string;
  date: string;
  readTime: string;
  image: string;
  images?: string[];
  tags: string[];
  keyPoints: string[];
  content: string;
  faqs?: { question: string; answer: string }[];
  metaTitle?: string;
  metaDescription?: string;
  status?: 'published' | 'draft';
  isFeatured?: boolean;
}

import initialBlogs from './blogs.json';

export function getAllBlogs(): BlogPost[] {
  if (Array.isArray(initialBlogs) && initialBlogs.length > 0) {
    return initialBlogs as BlogPost[];
  }
  return BLOG_POSTS;
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  const blogs = getAllBlogs();
  return blogs.find((b) => b.slug === slug);
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'environmental-protection-tree-plantation-lucknow-uttar-pradesh',
    title: 'Environmental Protection in Uttar Pradesh: How Massive Tree Plantation Drives are Restoring Lucknow’s Green Canopy',
    category: 'Environment Protection',
    excerpt: 'Rapid urbanization in Lucknow and central UP has heightened heat islands and air pollution. Discover how community-led native afforestation is bringing back clean air and biodiversity.',
    author: 'ITLC Environmental Conservation Wing',
    date: 'September 5, 2026',
    readTime: '6 min read',
    image: '/causes/environment_hero.jpg',
    tags: ['Environment', 'Tree Plantation', 'Lucknow', 'Uttar Pradesh', 'Clean Air', 'Biodiversity'],
    keyPoints: [
      'Urban Lucknow has witnessed a 14% contraction of dense tree cover over the last two decades.',
      'Over 25,000 native saplings (Neem, Peepal, Banyan, Jamun) planted with an 88% survival rate.',
      'Citizen involvement through "Adopt-a-Tree" drives ensures ongoing watering and tree guard protection.',
      'Community afforestation helps naturally filter particulate matter (PM 2.5 and PM 10) during winter smog.',
    ],
    content: `
## The Urgent Need for Green Belts in Central Uttar Pradesh

Lucknow, the historic capital of Uttar Pradesh, has experienced unprecedented infrastructural and demographic expansion over the last twenty years. While economic growth has connected communities and modernized transportation, it has also brought severe ecological consequences: expanding asphalt, concrete corridors, declining water tables, and worsening urban heat islands.

During the summer months, urban temperatures frequently exceed 44°C, creating unbearable heat for street vendors, daily wage workers, and school children. Come winter, heavy smog laden with toxic particulate matter (PM 2.5 and PM 10) blankets the city, aggravating bronchial ailments among children and senior citizens.

Against this backdrop, passive conservation is no longer adequate. What Uttar Pradesh requires is **active, aggressive, community-anchored afforestation**.

---

## Why Native Trees Matter: Neem, Peepal, Banyan, and Jamun

A common mistake in quick greening initiatives is the planting of non-native ornamental trees like Eucalyptus or Conocarpus, which consume disproportionate groundwater and support minimal local fauna. At ITLC Foundation, our environmental research team adheres strictly to **indigenous biodiverse species**:

1. **Neem (*Azadirachta indica*):** Renowned as nature's air purifier, Neem trees release oxygen for extended periods, possess antibacterial properties, and thrive in semi-arid soil without demanding excessive groundwater.
2. **Peepal (*Ficus religiosa*):** Capable of releasing oxygen round-the-clock, Peepal provides a broad leafy canopy that captures dust and airborne pollutants while housing over 40 species of birds and pollinators.
3. **Banyan (*Ficus benghalensis*):** Deep-rooted and resilient, Banyan trees act as soil anchors, preventing soil erosion along riverbanks and peri-urban roadways.
4. **Jamun & Bel (*Syzygium cumini* & *Aegle marmelos*):** In addition to cooling the atmosphere, these fruit-bearing native trees provide nourishment for urban wildlife and local birds.

---

## The "Adopt-a-Tree" Model: Beyond Mere Photo-Op Planting

The fundamental downfall of many corporate plantation drives is abandonment: saplings are planted for photographs during monsoon season and left to wither under the scorching summer sun without irrigation or fencing.

To overcome this, ITLC Foundation pioneered the **Adopt-a-Tree Stewardship Initiative**:
- **Geo-tagged Saplings:** Every batch of saplings planted across Golf City, Mohanlalganj, and outer ring roads in Lucknow is mapped.
- **Local Caretaker Networks:** We partner with nearby small shopkeepers, school groundskeepers, and residential societies, providing them with watering cans, organic compost, and protective iron tree guards.
- **Bi-weekly Maintenance Patrols:** Volunteer teams conduct regular weeding, staking, and drip-watering rounds, achieving an industry-leading **88% survival rate** across over 25,000 planted saplings.

---

## Citizen Action: What You Can Do Today

Environmental conservation is not the exclusive domain of government agencies; it starts on your own balcony, lane, and community park. You can:
- **Pledge a Tree:** Support the cost of a native sapling, protective guard, and 2-year maintenance through ITLC Foundation.
- **Join Weekend Green Drives:** Spend 2 hours every Sunday morning digging pits, planting saplings, and greening public schools.
- **Harvest Rainwater:** Prevent urban runoff by ensuring open soil patches in your home compound to recharge the Lucknow aquifer.

Together, we can build a resilient, breathable, and verdant Uttar Pradesh for generations to come.
    `,
  },
  {
    slug: 'animal-welfare-stray-rescue-feeding-care-uttar-pradesh',
    title: 'Compassion in Action: Stray Animal Welfare, Rescue, and Emergency Medical Care Across Lucknow',
    category: 'Animal Welfare',
    excerpt: 'Street dogs, abandoned cows, and birds face extreme hunger, road trauma, and climate stress. Learn how ITLC Foundation is providing emergency veterinary first aid, daily feeding, and humane rehabilitation.',
    author: 'ITLC Animal Welfare & Rescue Unit',
    date: 'September 2, 2026',
    readTime: '7 min read',
    image: '/causes/animal_welfare_hero.jpg',
    tags: ['Animal Welfare', 'Stray Rescue', 'Lucknow', 'Dog Shelter', 'Uttar Pradesh', 'Feeding Drive'],
    keyPoints: [
      'Over 600 street animals fed nutritious meals daily across multiple zones in Lucknow.',
      'More than 1,200 reflective safety collars installed to prevent nocturnal road accidents.',
      'Summer hydration drives deployed over 350 cement water bowls for strays and birds.',
      'Humane rabies vaccination and veterinary wound dressing drives conducted weekly.',
    ],
    content: `
## The Silent Struggle of Street Animals in Our Cities

In every neighborhood of Lucknow and across Uttar Pradesh, thousands of stray animals live alongside human society. From community indie dogs patrolling market squares to abandoned dairy cattle wandering busy highways, these sentient beings navigate a harsh existence marked by starvation, territorial vehicular accidents, dehydration in scorching summers, and shivering cold in winter.

Animal welfare is not merely an act of kindness—it is a fundamental public health and civic duty. When street animals are vaccinated, nourished, and treated with compassion, human-animal conflicts decline dramatically, rabies risks diminish, and communities become safer for everyone.

---

## Pillar 1: Daily Nutritious Feeding Drives

Urban strays frequently rely on garbage dumps and plastic-laced discarded food, leading to chronic gastrointestinal infections and malnutrition. 

ITLC Foundation operates a **Dedicated Community Feeding Network**:
- **Balanced Meals:** We prepare fresh, wholesome batches of rice, turmeric, boiled lentils, boiled eggs, and nutrient-dense broth daily.
- **Consistent Feeding Routes:** Street animals are creatures of habit. By feeding them at fixed times and designated quiet spots late in the evening or early morning, we prevent aggressive territorial fights and food begging near traffic intersections.
- **Hydration Bowls:** During the peak summer months (April to July), our volunteers install and regularly replenish **cement water bowls** outside shops and residential blocks, quenching the thirst of strays, squirrels, and birds.

---

## Pillar 2: Emergency First-Aid & Road Safety Collars

Road accidents represent the single largest cause of fatalities and severe trauma among street dogs in Uttar Pradesh. With poor street lighting on bypasses and ring roads, drivers often spot animals too late.

To counter this, ITLC Foundation launched the **Reflective Collar Safety Campaign**:
- We fit community dogs with durable, weather-resistant fluorescent **reflective collars**. When vehicle headlights hit the collar from hundreds of meters away, it shines brightly, giving drivers ample braking time.
- Over **1,200 dogs** have been fitted with these life-saving collars across Lucknow, reducing vehicular collisions in targeted zones by over 60%.
- Our mobile volunteer kit carries antiseptic sprays, maggot-wound powders (Negasunt/Topicure), bandage wraps, and pain-relief medications to treat minor lacerations and bite wounds on-the-spot.

---

## Pillar 3: Addressing Rabies & Humane Sterilization

The only proven, scientific, and humane method to stabilize stray dog populations and eliminate rabies is the **Animal Birth Control (ABC) and Anti-Rabies Vaccination (ARV)** protocol recommended by the World Health Organization (WHO).

Cruelty, relocation, or culling is both illegal under the Prevention of Cruelty to Animals Act, 1960, and counterproductive, as new un-vaccinated dogs quickly migrate into vacated territories. ITLC Foundation collaborates with registered local veterinary surgeons and municipal shelters to ensure street dogs are vaccinated against rabies and gently rehabilitated in their original home territories.

---

## How You Can Champion Animal Welfare in Your Neighborhood

- **Feed with Responsibility:** Provide clean food in eco-friendly bowls away from high-traffic doorways and clean up after feeding.
- **Place a Water Pot:** Place a simple earthen or cement pot of clean water outside your home or office gate and refill it daily.
- **Report Injuries Promptly:** If you encounter an injured or distressed animal in Lucknow, notify registered local rescue groups or veterinary clinics without delay.
- **Adopt, Don't Shop:** Indian indigenous (Indie) dogs are exceptionally intelligent, resilient, loyal, and naturally adapted to local weather. Give an Indie pup a loving home.
    `,
  },
  {
    slug: 'women-empowerment-skill-development-rural-uttar-pradesh',
    title: 'Empowering Women in Rural Uttar Pradesh: Vocational Training, Self-Help Groups, and Economic Independence',
    category: 'Women Empowerment',
    excerpt: 'When a woman earns, her entire family flourishes. Explore how sewing centers, digital financial literacy, and self-help collectives are transforming the lives of women in peri-urban Lucknow.',
    author: 'ITLC Women Empowerment Cell',
    date: 'August 28, 2026',
    readTime: '6 min read',
    image: '/causes/women_empowerment_hero.jpg',
    tags: ['Women Empowerment', 'Skill Development', 'Rural UP', 'Financial Literacy', 'Livelihoods'],
    keyPoints: [
      'Over 450 rural and semi-urban women trained in commercial stitching, sewing, and handicrafts.',
      'Digital literacy drives teaching UPI payments, Jan Dhan savings, and direct benefit transfers.',
      'Formation of community Self-Help Groups (SHGs) facilitating micro-enterprise and collective savings.',
      'Measurable increase in household investment towards girl child education and nutritious diets.',
    ],
    content: `
## The Catalyst for Intergenerational Change

In many peri-urban clusters and rural hamlets across Uttar Pradesh, women possess immense grit, resourcefulness, and creativity. Yet, systemic barriers—such as restricted mobility, lack of formalized vocational skills, and absence of independent financial accounts—have historically kept them dependent on male relatives for basic household necessities.

Economic empowerment is the definitive antidote to gender inequality. When a mother or daughter earns independent income, studies consistently prove that **over 90% of her earnings are reinvested directly into her family**: healthier food, cleaner drinking water, school uniforms, and medicines for children.

---

## The ITLC Skill & Tailoring Centers: From Learners to Entrepreneurs

To provide women with a dignified, scalable livelihood, ITLC Foundation established grassroots **Sewing, Tailoring & Handicraft Skill Centers** in underserved neighborhoods of Lucknow:

1. **Structured 6-Month Curriculum:** Women learn basic garment construction, blouse drafting, school uniform stitching, and intricate Lucknowi Chikankari embroidery.
2. **Quality Tooling:** Each participant trains on modern industrial sewing machines, learning maintenance, precision cutting, and fabric management.
3. **Market Linkages & Order Fulfillment:** Training without income is incomplete. ITLC Foundation bridges our graduates with local cloth merchants, school uniform contracts, and festival bag orders, ensuring that every woman earns while learning.

Graduates frequently establish home-based tailoring boutiques or form small sewing cooperatives, generating an average monthly income of **₹6,000 to ₹12,000**—transforming their status within their households from dependents to respected decision-makers.

---

## Digital Financial Literacy: Unlocking Independence

Earning money is step one; retaining and growing financial assets is step two. Many rural women who receive cash payments are vulnerable to having their earnings appropriated by others.

ITLC Foundation conducts targeted **Digital & Banking Literacy Workshops**:
- **Zero-Balance Accounts:** Assisting women in opening and operating their individual bank accounts under Pradhan Mantri Jan Dhan Yojana.
- **Secure UPI & Mobile Banking:** Training women to use smartphone payment apps securely, verifying SMS transaction alerts, and guarding against fraud or sharing OTPs.
- **Micro-Savings:** Encouraging women to deposit small weekly sums into savings accounts, building an emergency buffer against medical crises or crop failures.

---

## Breaking Taboos: Menstrual Hygiene & Dignity Drives

Economic independence is deeply intertwined with physical health and dignity. In impoverished semi-urban areas, lack of awareness and financial constraints force many adolescent girls and young mothers to rely on unhygienic alternatives, resulting in recurring infections and missed school or work days.

Alongside skill workshops, ITLC Foundation regularly conducts **Dignity Camps**:
- Distribution of biodegradable, affordable sanitary pads.
- Medical sessions debunking age-old stigmas surrounding menstruation.
- Constructing and refurbishing private, sanitized washroom stalls in community education clusters.

---

## Moving Forward Together

True progress in Uttar Pradesh cannot be achieved if half of its population remains sidelined from the productive economy. By equipping women with sustainable craft skills, financial acumen, and health dignity, ITLC Foundation is helping write a new narrative of self-reliance, leadership, and pride across Uttar Pradesh.
    `,
  },
  {
    slug: 'education-support-underprivileged-slum-children-lucknow',
    title: 'Bridging the Learning Divide: Quality Education Support for Underprivileged and Slum Children in Lucknow',
    category: 'Education Support',
    excerpt: 'Poverty should never be a barrier to a child’s imagination and learning. Read how free school kits, remedial coaching, and digital classrooms are keeping vulnerable children in school.',
    author: 'ITLC Education & Child Development Desk',
    date: 'August 20, 2026',
    readTime: '7 min read',
    image: '/ref/hero_boy_hd.jpg',
    tags: ['Education', 'Child Welfare', 'Slum Children', 'Lucknow', 'Literacy', 'School Kits'],
    keyPoints: [
      'Over 2,800 school kits (backpacks, notebooks, geometry boxes, stationery) distributed annually.',
      'After-school remedial learning centers helping first-generation learners pass foundational grades.',
      'Parental counseling initiatives cutting primary school dropout rates by over 45% in target pockets.',
      'Introduction of basic digital tablets and storytelling sessions to kindle curiosity and scientific temper.',
    ],
    content: `
## The Hidden Crisis in Foundational Learning

Education is universally recognized as the most potent equalizer in human society. Yet, in the informal settlements, brick kiln belts, and migrant laborer clusters of Lucknow and surrounding Uttar Pradesh districts, thousands of young minds are at severe risk of dropping out before completing upper primary school.

The issue is rarely a lack of desire to learn; children in underprivileged clusters are vibrant, eager, and curious. Instead, the barrier is twofold:
1. **Economic Friction:** The inability of daily-wage earning parents to purchase new notebooks, school uniforms, shoes, and stationery each academic term.
2. **The "First-Generation" Learning Barrier:** When parents are illiterate, children have no academic guidance at home. If a child falls behind in foundational reading or basic mathematics in Class 2 or 3, embarrassment and confusion lead directly to permanent absenteeism and child labor.

---

## Step 1: Eliminating Economic Friction with Comprehensive School Kits

At the start of every academic session, ITLC Foundation organizes the **"Shiksha Umeed" School Supply Drive**:
- **High-Quality Backpacks:** Sturdy, water-resistant school bags that can endure daily walks on dusty lanes.
- **Complete Stationery Sets:** Multi-subject notebooks, pens, pencils, erasers, sharpeners, rulers, and geometry kits.
- **Hygiene & Utility Essentials:** Stainless steel water bottles and lunch boxes, keeping children hydrated and nourished throughout school hours.

By eliminating this upfront cost for impoverished families, we remove the primary excuse for withholding a child from enrolling in government and subsidized community schools. Over **2,800 children** have been equipped with these learning kits in the past year alone.

---

## Step 2: Remedial Learning Centers (Gyan Kendras)

Equipping a child with a bag is useless if they cannot read the letters inside their textbook. ITLC Foundation operates **After-School Remedial Gyan Kendras** in targeted community centers:

- **Passionate Volunteer Teachers:** College students, retired educators, and young professionals volunteer 2 hours every evening.
- **Foundational Literacy & Numeracy:** Using joyful learning aids, flashcards, phonics, and abacus counting, we ensure every child achieves age-appropriate reading and math competency.
- **Digital Curiosity Labs:** Introducing tablet computers with educational story apps, opening windows to geography, science experiments, and global wonders that spark ambition beyond generational poverty.

---

## Step 3: Engaging Parents & Eradicating Child Labor

A critical pillar of our educational model is continuous **Parent-Teacher Community Meetings**. We engage daily wage laborers, rickshaw pullers, and domestic workers, helping them understand that enrolling a daughter or son in school is not a loss of short-term daily wages, but an investment that permanently lifts their family out of poverty.

We also assist families in navigating government documentation—including Aadhaar card corrections, birth certificates, and opening student scholarship bank accounts—ensuring no child is denied enrollment due to bureaucratic bottlenecks.

---

## A Call to Mentors & Donors

Every child you see working at a roadside tea stall or rag-picking on a street corner possesses the latent talent to become a doctor, engineer, teacher, or public leader. All they require is an opportunity, a notebook, and someone who believes in their potential. 

Partner with ITLC Foundation today by sponsoring a child’s educational kit or volunteering your evenings as a remedial mentor.
    `,
  },
  {
    slug: 'clean-water-sanitation-hygiene-communities-uttar-pradesh',
    title: 'Clean Water & Sanitation: Ensuring Safe Drinking Water and Hygiene Awareness in Semi-Urban Communities',
    category: 'Clean Water & Sanitation',
    excerpt: 'Waterborne diseases rob children of school days and drain family savings. Discover our initiatives to install water testing, clean storage systems, and health hygiene workshops in UP.',
    author: 'ITLC Public Health & Sanitation Team',
    date: 'August 14, 2026',
    readTime: '6 min read',
    image: '/causes/clean_water_hero.jpg',
    tags: ['Clean Water', 'Sanitation', 'Public Health', 'Uttar Pradesh', 'Hygiene Awareness'],
    keyPoints: [
      'Contaminated groundwater and lack of covered storage remain leading causes of diarrhea and typhoid in rural UP.',
      'Deployment of food-grade water storage drums and community filtration points in vulnerable clusters.',
      'WASH (Water, Sanitation, and Hygiene) school workshops educating over 3,500 children on effective handwashing.',
      'Regular water quality testing (pH, TDS, bacterial presence) with local civic health departments.',
    ],
    content: `
## The Silent Toll of Waterborne Illnesses

Clean drinking water is not a luxury; it is a fundamental human right. Yet across semi-urban fringes and rural settlements in Uttar Pradesh, shallow hand pumps often draw water contaminated with high total dissolved solids (TDS), excess iron, nitrates, and microbial pathogens from unlined open drainage.

According to public health data, waterborne ailments—including acute diarrheal disease, typhoid, cholera, and hepatitis A—are among the leading causes of child mortality and chronic stunting among children under five in India. For a laborer earning ₹400 a day, a single bout of typhoid in the family drains weeks of savings in private clinic bills, forcing families into devastating informal debt.

---

## Clean Water Interventions: Storage & Filtration

The vulnerability in many households occurs not just at the water source, but in the home. Water collected from municipal taps or tube-wells is often stored in wide-mouth buckets without lids, where dust, flies, and unwashed hands cause rapid recontamination.

ITLC Foundation addresses this through a pragmatic, community-centered approach:
1. **Food-Grade Covered Storage Units:** Distributing 25-liter durable, food-grade water containers equipped with push-taps and secure screw lids. This single modification prevents hand immersion, cutting bacterial recontamination by up to 75%.
2. **Community Bio-Sand & Ceramic Filters:** Installing low-maintenance, electricity-free gravity water purification filters in high-density informal learning centers and community shelters.
3. **Periodic Water Testing:** Our team conducts field chemical and microbial testing on tube-wells across project sites, labeling contaminated pumps with prominent red warning markers and coordinating with Jal Sansthan and village panchayats for remedial deep-bore installations.

---

## The WASH Education Framework in Schools

Infrastructure without behavioral change fails. To ensure lasting health dividends, ITLC Foundation conducts interactive **WASH (Water, Sanitation, and Hygiene) Campaigns** in primary schools:

- **The 6-Step Handwashing Drill:** Teaching children how to properly wash hands with soap for at least 20 seconds before eating and after using washrooms through catchy songs and demonstrations.
- **Germ Visualizers:** Using glitter powder and magnifying glasses to visually show children how microscopic germs cling to fingernails and palms even when hands look superficially clean.
- **Hygiene Ambassadors:** Appointing enthusiastic young students as "Swachhta Monitors" to ensure school washroom taps are turned off, water points remain clean, and peers wash hands before midday meals.

---

## The Path to Healthier Communities

Clean water and sanitation are the bedrock upon which education, nutrition, and livelihood thrive. When children are healthy and free from recurring gastrointestinal infections, school attendance skyrockets, parents save precious income, and communities become vibrant and resilient. 

ITLC Foundation remains dedicated to expanding our safe water storage distribution and water testing camps across every underserved district of Uttar Pradesh.
    `,
  },
  {
    slug: 'social-welfare-grassroots-community-upliftment-uttar-pradesh',
    title: 'Grassroots Social Welfare in Uttar Pradesh: Winter Relief, Food Security, and Holistic Community Care',
    category: 'Social Welfare',
    excerpt: 'From freezing winter nights on pavements to emergency hunger relief, discover how ITLC Foundation provides immediate humanitarian aid while building long-term community resilience.',
    author: 'ITLC Social Welfare & Relief Directorate',
    date: 'August 08, 2026',
    readTime: '7 min read',
    image: '/causes/social_welfare_hero.jpg',
    tags: ['Social Welfare', 'Winter Relief', 'Food Security', 'Lucknow', 'Uttar Pradesh', 'Humanitarian Aid'],
    keyPoints: [
      'Over 4,000 thermal blankets and warm winter jackets distributed to homeless citizens and night shelters.',
      'Emergency dry ration kits (wheat flour, rice, pulses, cooking oil, salt) delivered during crisis periods.',
      'Support for abandoned senior citizens with emergency medical supplies and walking aids.',
      'Collaboration with district disaster and administrative teams for rapid humanitarian response.',
    ],
    content: `
## Compassion at the Grassroots: Leaving No One Behind

A truly civilized society is measured not by the grandeur of its monuments or the wealth of its elite, but by how it cares for its most vulnerable members: the elderly abandoned on city streets, the migrant laborer sleeping under an overpass, and the impoverished family struggling to put two meals on the table.

In Uttar Pradesh, India’s most populous state, millions of citizens live on the razor’s edge of economic vulnerability. An unexpected medical expenditure, a harsh monsoon downpour that washes away a temporary shanty, or a severe winter cold wave can plunge a family into extreme distress. 

ITLC Foundation was founded on the singular principle of **"Seva Paramo Dharmah"**—compassionate service without discrimination of caste, creed, gender, or religion.

---

## Winter Warmth Drives: Saving Lives on Freezing Nights

The northern Indian winter between December and January is brutal. Temperatures in Lucknow and central Uttar Pradesh frequently dip below 4°C, accompanied by dense, damp fog and icy winds. For citizens sleeping on railway platforms, outside government hospitals, or under flyovers, exposure to extreme cold is fatal.

Every winter, ITLC Foundation mobilizes the **"Winter Warmth Relief Brigade"**:
- **Late-Night Patrolling Teams:** Volunteers scour bus terminals, government hospital verandahs (KGMU, Civil Hospital, Balrampur Hospital), and construction labor colonies from 10 PM to 2 AM.
- **Heavyweight Thermal Blankets:** We distribute thick, high-insulation blankets directly to individuals shivering without shelter.
- **Children's Winter Woolens:** Delivering sweaters, caps, socks, and shoes to children in slum settlements, preventing pneumonia and winter hypothermia.
- Over **4,000 lives** were protected with thermal warmth during our recent winter campaign.

---

## Annapurna Food Security: Eradicating Hunger

No child or elder should go to bed hungry. While national food distribution programs exist, elderly widows, destitute migrants, and un-rationed families often slip through administrative cracks.

ITLC Foundation operates targeted **Food Security Drives**:
- **Nutritious Cooked Meals:** Freshly prepared hot meals served during disaster relief, seasonal unemployment spells, and medical emergency camps.
- **Monthly Dry Ration Kits:** Delivering 15 kg ration hampers containing premium wheat flour (Atta), rice, high-protein pulses (Daal), mustard oil, iodized salt, and essential spices to verified destitute elderly citizens and single-mother households.

---

## Holistic Elder Care & Dignity Support

Among the most neglected demographics in expanding urban centers are destitute senior citizens. Many suffer from untreated cataract blindness, osteoarthritis, and chronic illnesses, unable to afford simple generic medications.

ITLC Foundation conducts:
- Free health screening camps in suburban villages with voluntary doctors.
- Distribution of walking canes, spectacles, and basic mobility aids.
- Emotional companionship visits by young youth volunteers, bringing warmth and respect back into the lives of our elders.

---

## How You Can Make a Tangible Difference

A community is only as strong as its willingness to stand up for those in need. Every blanket you sponsor, every meal kit you fund, and every hour you volunteer directly rescues a fellow human being from despair.

Join hands with ITLC Foundation. Together, we can ensure that every corner of Uttar Pradesh is illuminated with care, dignity, and brotherhood.
    `,
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  const blogs = getAllBlogs();
  return blogs.find((p) => p.slug === slug);
}

export function getRelatedBlogPosts(currentSlug: string, limit = 3): BlogPost[] {
  const blogs = getAllBlogs();
  return blogs.filter((p) => p.slug !== currentSlug).slice(0, limit);
}
