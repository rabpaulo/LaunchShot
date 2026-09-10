import type { AsoTone } from './aso';

export interface AsoSlideCopy {
  title: string;
  subtitle: string;
}

export interface AsoStoryArc {
  hook: AsoSlideCopy;
  pain: AsoSlideCopy;
  feature: AsoSlideCopy;
  superpower: AsoSlideCopy;
  cta: AsoSlideCopy;
}

export interface DomainCopyConfig {
  keywords: string[];
  tones: Record<AsoTone, AsoStoryArc[]>;
}

export const ASO_DOMAINS: Record<string, DomainCopyConfig> = {
  fitness: {
    keywords: ['fitness', 'workout', 'gym', 'health', 'exercise', 'weight', 'run', 'lifting', 'muscle', 'crossfit', 'bodybuilding', 'coach', 'trainer', 'strength', 'cardio', 'reps', 'sets'],
    tones: {
      'high-converting': [
        {
          hook: { title: 'Crush Every Workout Goal', subtitle: 'Personalized training routines engineered for real, lasting strength.' },
          pain: { title: 'Ditch the Paper Notebook', subtitle: 'Log reps, sets, and weights in seconds with zero friction.' },
          feature: { title: 'Track Progressive Overload Effortlessly', subtitle: 'Visual strength curves and automated weight increments.' },
          superpower: { title: '100% Offline Gym Access', subtitle: 'No basement gym wifi needed. Full telemetry anytime, anywhere.' },
          cta: { title: 'Start Your Transformation Today', subtitle: 'Join over 500,000 athletes training smarter every day.' }
        },
        {
          hook: { title: 'Train Smarter, Lift Heavier', subtitle: 'Data-driven training programs tailored to your muscle recovery.' },
          pain: { title: 'No More Guessing Weights', subtitle: 'Smart 1RM calculators and optimal rest intervals between sets.' },
          feature: { title: 'In-Depth Muscle Recovery Heatmaps', subtitle: 'Know exactly when your chest, back, and legs are ready to train.' },
          superpower: { title: 'Bank-Grade Privacy & Offline', subtitle: 'Your personal biometric health data stays strictly on your device.' },
          cta: { title: 'Reach Your Peak Strength', subtitle: 'Download free today and see measurable results in weeks.' }
        }
      ],
      'apple-minimalist': [
        {
          hook: { title: 'Strength. Simplified.', subtitle: 'Clean, distraction-free tracker with automatic rest timers.' },
          pain: { title: 'Pure Focus.', subtitle: 'No bloated menus or confusing setup. Just lift and log.' },
          feature: { title: 'Precision in Every Rep.', subtitle: 'Fluid gestures designed for quick logging during heavy sets.' },
          superpower: { title: 'Private by Design.', subtitle: 'On-device telemetry that protects your health records.' },
          cta: { title: 'Begin Today.', subtitle: 'Available free on the App Store.' }
        }
      ],
      'feature-tech': [
        {
          hook: { title: 'Pro-Grade Lifting Telemetry Engine', subtitle: 'Precision velocity tracking, RPE analytics, and rest automation.' },
          pain: { title: 'Sub-Second Logging Architecture', subtitle: 'One-tap rep entry with smart superset and drop-set support.' },
          feature: { title: 'Dynamic 1RM Progression Matrix', subtitle: 'Algorithmic volume titration prevents overtraining and fatigue.' },
          superpower: { title: '100% Offline & Encrypted', subtitle: 'Zero cloud dependencies. Instant response times under 50ms.' },
          cta: { title: 'Upgrade Your Workout Arsenal', subtitle: 'The ultimate tool for strength coaches and serious powerlifters.' }
        }
      ],
      'social-proof': [
        {
          hook: { title: 'The #1 Rated Gym App', subtitle: 'Over 80,000 five-star reviews from verified powerlifters and coaches.' },
          pain: { title: 'Why Half a Million Athletes Switched', subtitle: 'Voted Best Workout Companion by leading fitness publications.' },
          feature: { title: 'Join a Dedicated Global Community', subtitle: 'Compare PRs, follow verified training programs, and stay accountable.' },
          superpower: { title: 'Trusted by Elite Trainers', subtitle: 'Built with sports scientists and certified strength professionals.' },
          cta: { title: 'Claim Your Free Pro Pass', subtitle: 'Download today and unlock full access to all verified routines.' }
        }
      ],
      'problem-solution': [
        {
          hook: { title: 'Stuck on a Fitness Plateau?', subtitle: 'Break through stubborn plateaus with progressive overload tracking.' },
          pain: { title: 'Stop Wasting Time in the Gym', subtitle: 'Say goodbye to random routines and unfocused workout sessions.' },
          feature: { title: 'Structured Progression Made Easy', subtitle: 'Follow clear, progressive paths tailored to your schedule and goals.' },
          superpower: { title: 'Zero Ads, Zero Annoyances', subtitle: 'Distraction-free workout tracking with transparent terms.' },
          cta: { title: 'Transform Your Body Now', subtitle: 'Start your journey with a structured 30-day program today.' }
        }
      ],
      'playful-vibrant': [
        {
          hook: { title: 'Level Up Your Strength!', subtitle: 'Turn every gym workout into an exciting game of progress and milestones.' },
          pain: { title: 'Smash Everyday Plateaus with Ease', subtitle: 'Earn streaks, unlock achievements, and beat personal bests.' },
          feature: { title: 'Celebrate Every New PR', subtitle: 'Colorful badges and animations make heavy lifting pure fun.' },
          superpower: { title: 'Fast, Smooth, and Battery-Friendly', subtitle: 'Designed to run all workout long without draining battery.' },
          cta: { title: 'Join the Fitness Party Today', subtitle: 'Download free and make workouts the best part of your day.' }
        }
      ]
    }
  },

  meditation: {
    keywords: ['meditation', 'sleep', 'anxiety', 'calm', 'relax', 'insomnia', 'breathe', 'mindfulness', 'soundscape', 'sound', 'stress', 'bedtime', 'rest'],
    tones: {
      'high-converting': [
        {
          hook: { title: 'Fall Asleep in Minutes', subtitle: 'Science-backed soundscapes and bedtime stories designed for deep sleep.' },
          pain: { title: 'End Sleepless Nights for Good', subtitle: 'Silence racing thoughts and calm evening anxiety naturally.' },
          feature: { title: '100+ Ambient White Noise Layers', subtitle: 'Mix rain, ocean waves, binaural beats, and gentle chimes.' },
          superpower: { title: '100% Offline Night Mode', subtitle: 'Sleep peacefully without midnight notifications or internet needed.' },
          cta: { title: 'Wake Up Refreshed Tomorrow', subtitle: 'Join over 2 million well-rested sleepers worldwide.' }
        }
      ],
      'apple-minimalist': [
        {
          hook: { title: 'Sleep. Refined.', subtitle: 'A calm space to unwind, breathe, and restore balance.' },
          pain: { title: 'Quiet Your Mind.', subtitle: 'Gentle guided sessions that ease daily stress in minutes.' },
          feature: { title: 'Subtle Acoustic Landscapes.', subtitle: 'Binaural frequencies recorded in pristine spatial audio.' },
          superpower: { title: 'Private and Distraction-Free.', subtitle: 'No account required. Your wellbeing data stays yours.' },
          cta: { title: 'Find Calm Today.', subtitle: 'Download free on the App Store.' }
        }
      ],
      'feature-tech': [
        {
          hook: { title: 'Clinical Sleep Architecture Suite', subtitle: 'Engineered with neuroscientists to optimize REM and deep sleep cycles.' },
          pain: { title: 'Algorithmic Acoustic Frequency Modulation', subtitle: 'Dynamic pink noise and delta wave pulses lower heart rate variability.' },
          feature: { title: 'Sleep Hygiene Telemetry & Insights', subtitle: 'Track sleep debt, latency metrics, and optimal bedtime windows.' },
          superpower: { title: 'On-Device Audio DSP Synthesis', subtitle: 'Real-time noise filtering without streaming latency or battery drain.' },
          cta: { title: 'Optimize Your Rest Cycles', subtitle: 'Pro-grade circadian rhythm management available today.' }
        }
      ],
      'social-proof': [
        {
          hook: { title: 'The #1 Rated Sleep App', subtitle: 'Loved by over 2M+ rested users with 98% reporting faster sleep.' },
          pain: { title: 'Why Doctors Recommend Our Sessions', subtitle: 'Featured by Apple as App of the Day and Health & Fitness Best.' },
          feature: { title: 'Over 50,000 Five-Star Reviews', subtitle: 'Experience the evening routine that changed millions of lives.' },
          superpower: { title: 'Clinically Validated Audio Programs', subtitle: 'Developed alongside leading sleep clinic researchers.' },
          cta: { title: 'Claim Your 7-Day Rest Pass', subtitle: 'Start tonight and experience your best night of sleep ever.' }
        }
      ],
      'problem-solution': [
        {
          hook: { title: 'Tired of Tossing and Turning?', subtitle: 'Fall asleep in under 15 minutes without medication or morning grogginess.' },
          pain: { title: 'Stop Letting Stress Steal Your Rest', subtitle: 'Break the exhausting loop of late-night anxiety and racing thoughts.' },
          feature: { title: 'Gentle Guided Wind-Down Routines', subtitle: 'Calming breathing exercises slow down your nervous system.' },
          superpower: { title: 'Safe, Private, and Zero Ads', subtitle: 'No unexpected pop-ups or loud wakeups in the middle of the night.' },
          cta: { title: 'Get Deep Rest Tonight', subtitle: 'Download now and sleep soundly starting from night one.' }
        }
      ],
      'playful-vibrant': [
        {
          hook: { title: 'Sweet Dreams Guaranteed!', subtitle: 'Drift off to cozy bedtime stories, soothing rain, and calm vibes.' },
          pain: { title: 'Say Goodbye to Grumpy Mornings', subtitle: 'Wake up smiling and full of positive energy every single day.' },
          feature: { title: 'Mix Your Dream Soundscapes', subtitle: 'Combine crackling fires, gentle cats purring, and summer night skies.' },
          superpower: { title: 'Completely Ad-Free & Cozy', subtitle: 'Pure peace of mind for the ultimate bedtime sanctuary.' },
          cta: { title: 'Start Sleeping Better Now', subtitle: 'Tap to begin your coziest night yet.' }
        }
      ]
    }
  },

  finance: {
    keywords: ['finance', 'money', 'budget', 'crypto', 'expense', 'wallet', 'invest', 'banking', 'spending', 'bitcoin', 'stocks', 'savings'],
    tones: {
      'high-converting': [
        {
          hook: { title: 'Take Control of Your Wealth', subtitle: 'The modern wealth and expense tracker built for high achievers.' },
          pain: { title: 'No More Spreadsheet Chaos', subtitle: 'Automatically categorize transactions with sub-second accuracy.' },
          feature: { title: 'Visual Cashflow & Net Worth Radar', subtitle: 'Real-time multi-account analytics and monthly burn rate metrics.' },
          superpower: { title: 'Bank-Grade AES-256 Encryption', subtitle: 'Your financial balance sheets are private and locally encrypted.' },
          cta: { title: 'Build True Financial Freedom', subtitle: 'Join over 1,000,000 people growing their savings today.' }
        }
      ],
      'apple-minimalist': [
        {
          hook: { title: 'Wealth. In Focus.', subtitle: 'See your entire financial picture with total clarity.' },
          pain: { title: 'Effortless Tracking.', subtitle: 'Smart expense categorization without complicated spreadsheets.' },
          feature: { title: 'Every Dollar Accounted For.', subtitle: 'Intuitive monthly budgets that keep your savings on track.' },
          superpower: { title: 'Bank-Level Privacy.', subtitle: 'Zero tracking. Your financial records are strictly confidential.' },
          cta: { title: 'Begin Today.', subtitle: 'Download free on the App Store.' }
        }
      ],
      'feature-tech': [
        {
          hook: { title: 'High-Performance Financial Ledger', subtitle: 'Multi-currency accounting engine with sub-50ms balance updates.' },
          pain: { title: 'Automated Cashflow Titration Matrix', subtitle: 'Detect recurring subscriptions and predict 90-day cash liquidity.' },
          feature: { title: 'Unified Asset & Portfolio Telemetry', subtitle: 'Track equities, real estate, and crypto holdings in one single ledger.' },
          superpower: { title: 'Zero-Knowledge Security Standard', subtitle: 'End-to-end client-side encryption. We cannot see your balances.' },
          cta: { title: 'Deploy Your Financial Engine', subtitle: 'The premier choice for founders, freelancers, and investors.' }
        }
      ],
      'social-proof': [
        {
          hook: { title: 'The #1 Rated Wealth Tracker', subtitle: 'Loved by 1M+ savers and rated 4.9 stars across 120,000 reviews.' },
          pain: { title: 'Why Top Investors Choose Us', subtitle: 'Featured by Forbes, TechCrunch, and Apple as the top personal finance app.' },
          feature: { title: 'Join Over $2B in Tracked Wealth', subtitle: 'A trusted global community mastering saving and compounding.' },
          superpower: { title: 'Independently Audited Security', subtitle: 'SOC-2 compliant infrastructure protecting your financial assets.' },
          cta: { title: 'Start Growing Your Savings', subtitle: 'Download today and take charge of your financial future.' }
        }
      ],
      'problem-solution': [
        {
          hook: { title: 'Where Did Your Money Go?', subtitle: 'Stop mystery spending and find hundreds in forgotten subscriptions.' },
          pain: { title: 'Tired of Running Out of Cash?', subtitle: 'Clear monthly budgets warn you before you overspend, not after.' },
          feature: { title: 'Smart Automated Category Caps', subtitle: 'Simple visual bars show exactly how much you have left to spend.' },
          superpower: { title: 'No Annoying Upsells or Ads', subtitle: 'Clean, transparent financial management with zero data sharing.' },
          cta: { title: 'Stop Overspending Today', subtitle: 'Set up your first automated budget in under two minutes.' }
        }
      ],
      'playful-vibrant': [
        {
          hook: { title: 'Make Saving Money Fun!', subtitle: 'Level up your bank account and smash your monthly savings goals.' },
          pain: { title: 'Say Goodbye to Boring Spreadsheets', subtitle: 'Colorful charts and instant alerts keep spending in sweet harmony.' },
          feature: { title: 'Celebrate Every Financial Win', subtitle: 'Earn streaks, unlock savings badges, and watch wealth multiply.' },
          superpower: { title: 'Safe, Clean & Family Friendly', subtitle: 'Total privacy protection with effortless daily peace of mind.' },
          cta: { title: 'Join the Savings Club Today', subtitle: 'Start free and see how fast your piggy bank grows.' }
        }
      ]
    }
  },

  productivity: {
    keywords: ['productivity', 'notes', 'tasks', 'todo', 'planner', 'organize', 'markdown', 'focus', 'kanban', 'routine', 'calendar', 'work'],
    tones: {
      'high-converting': [
        {
          hook: { title: 'Organize Life in One Place', subtitle: 'The unified workspace for notes, tasks, and high-impact daily planning.' },
          pain: { title: 'End To-Do List Overwhelm', subtitle: 'Natural language task capture sorts priorities in under two seconds.' },
          feature: { title: 'Visual Timelines & Kanban Boards', subtitle: 'Switch seamlessly between daily agendas, checklists, and project views.' },
          superpower: { title: 'Instant Offline Two-Way Sync', subtitle: 'Works instantly on subways and flights with automatic cloud merge.' },
          cta: { title: 'Reclaim 5 Hours Every Week', subtitle: 'Join over 1 million productive thinkers and creators today.' }
        }
      ],
      'apple-minimalist': [
        {
          hook: { title: 'Clarity. Restored.', subtitle: 'A calm, minimal workspace crafted for deep, unhurried focus.' },
          pain: { title: 'Zero Distractions.', subtitle: 'Capture thoughts at the speed of mind without messy toolbars.' },
          feature: { title: 'Fluid Markdown Elegance.', subtitle: 'Fast typography designed to let your writing breathe naturally.' },
          superpower: { title: 'Private & Local-First.', subtitle: 'All notes encrypted on your device with instant iCloud sync.' },
          cta: { title: 'Begin Writing Today.', subtitle: 'Download free on the App Store.' }
        }
      ],
      'feature-tech': [
        {
          hook: { title: 'High-Throughput Knowledge Engine', subtitle: 'Sub-30ms search indexing across 100,000+ local markdown records.' },
          pain: { title: 'Universal Hotkey Task Capture', subtitle: 'Smart regex parsing detects due dates, priority flags, and tags.' },
          feature: { title: 'Bi-Directional Graph Relationships', subtitle: 'Visualize connected ideas with interactive topological link maps.' },
          superpower: { title: '100% Local-First & Git-Compatible', subtitle: 'Zero vendor lock-in. Plain text files stored on your filesystem.' },
          cta: { title: 'Supercharge Your Second Brain', subtitle: 'The definitive tool for software engineers and researchers.' }
        }
      ],
      'social-proof': [
        {
          hook: { title: 'The #1 Rated Productivity Tool', subtitle: 'Winner of Apple Design Award and trusted by over 1,500,000 users.' },
          pain: { title: 'Why Teams at Top Companies Switched', subtitle: 'Streamline individual focus and weekly deliverables with ease.' },
          feature: { title: 'Over 100,000 Five-Star Reviews', subtitle: 'Rated the cleanest, most reliable personal task manager available.' },
          superpower: { title: 'Bank-Grade Enterprise Security', subtitle: 'End-to-end encryption with zero third-party tracking or telemetry.' },
          cta: { title: 'Join the High Achievers Club', subtitle: 'Download free today and transform how you plan your day.' }
        }
      ],
      'problem-solution': [
        {
          hook: { title: 'Never Lose a Great Idea Again', subtitle: 'Stop letting scattered notes and forgotten to-dos cause daily chaos.' },
          pain: { title: 'Tired of Juggling 5 Different Apps?', subtitle: 'One single app replaces your notes, checklists, and calendar clutter.' },
          feature: { title: 'Smart Daily Planning Assistant', subtitle: 'Surfaces exactly what you need to focus on today, nothing else.' },
          superpower: { title: 'Blazing Fast and Zero Ads', subtitle: 'Opens instantly with zero loading spinners or laggy cloud delays.' },
          cta: { title: 'Get Organized in 60 Seconds', subtitle: 'Download now and clear your mental headspace immediately.' }
        }
      ],
      'playful-vibrant': [
        {
          hook: { title: 'Your Best Work Yet!', subtitle: 'Turn checking off your daily tasks into pure, satisfying delight.' },
          pain: { title: 'Say Goodbye to Boring Checklists', subtitle: 'Playful sound effects and smooth haptics reward your daily momentum.' },
          feature: { title: 'Smash Deadlines with a Smile', subtitle: 'Unlock cheerful badges and keep your productivity streak alive.' },
          superpower: { title: 'Lightweight & Lightning Fast', subtitle: 'Never slows you down, so you can do what you love most.' },
          cta: { title: 'Start Crushing Tasks Today', subtitle: 'Tap to start your most productive chapter yet.' }
        }
      ]
    }
  },

  nutrition: {
    keywords: ['nutrition', 'calorie', 'macros', 'diet', 'meal', 'food log', 'keto', 'fasting', 'protein', 'counter', 'healthy', 'recipes'],
    tones: {
      'high-converting': [
        {
          hook: { title: 'Master Your Daily Nutrition', subtitle: 'Effortless food logging, smart macro targets, and intermittent fasting.' },
          pain: { title: 'No More Complex Weighing', subtitle: 'Snap a photo of your plate for instant AI calorie and macro analysis.' },
          feature: { title: 'Track Protein, Carbs, and Fats', subtitle: 'Visual circular rings show your daily macro balance in real time.' },
          superpower: { title: '100% Offline Barcode Scanner', subtitle: 'Scan over 3 million verified foods without waiting for reception.' },
          cta: { title: 'Reach Your Dream Weight', subtitle: 'Join 500,000+ happy members feeling lighter and energized.' }
        }
      ],
      'apple-minimalist': [
        {
          hook: { title: 'Nourish. In Balance.', subtitle: 'Clean, simple food tracking designed to build healthy habits.' },
          pain: { title: 'Zero Clutter.', subtitle: 'Log meals in seconds with a fast, uncluttered interface.' },
          feature: { title: 'Clear Daily Macro Insight.', subtitle: 'Beautiful rings show your energy balance at a glance.' },
          superpower: { title: 'Private by Design.', subtitle: 'Your health records and food choices stay strictly on your phone.' },
          cta: { title: 'Begin Today.', subtitle: 'Available free on the App Store.' }
        }
      ],
      'feature-tech': [
        {
          hook: { title: 'Precision Macro Telemetry Suite', subtitle: 'Micronutrient tracking, glycemic index curves, and metabolic rate indexing.' },
          pain: { title: 'Sub-Second Barcode Processing', subtitle: 'Local database of 5M+ verified items with USDA-certified nutritional data.' },
          feature: { title: 'Adaptive Caloric Titration Curves', subtitle: 'Dynamic expenditure algorithms adjust intake based on activity metrics.' },
          superpower: { title: 'Zero Cloud Latency & Encrypted', subtitle: 'Fastest logging speed on mobile with complete offline privacy.' },
          cta: { title: 'Optimize Your Metabolic Health', subtitle: 'The choice tool for clinical dietitians and physique athletes.' }
        }
      ],
      'social-proof': [
        {
          hook: { title: 'The #1 Rated Nutrition App', subtitle: 'Over 50,000 five-star reviews from verified members reaching their goals.' },
          pain: { title: 'Why 1M+ Members Switched to Us', subtitle: 'Recommended by certified nutritionists and top fitness coaches.' },
          feature: { title: 'Join a Supportive Healthy Tribe', subtitle: 'Share clean recipes, celebrate weight milestones, and stay inspired.' },
          superpower: { title: 'Clinically Backed Nutrition Science', subtitle: 'Developed with metabolic researchers and registered dietitians.' },
          cta: { title: 'Start Your Healthy Journey', subtitle: 'Download today and unlock full access to verified meal plans.' }
        }
      ],
      'problem-solution': [
        {
          hook: { title: 'Tired of Restrictive Diets?', subtitle: 'Eat the foods you love while hitting your body composition targets.' },
          pain: { title: 'Stop Feeling Guilty About Food', subtitle: 'Flexible dieting principles replace crash diets with sustainable habits.' },
          feature: { title: 'Instant Photo Food Logging', subtitle: 'Skip tedious typing. Just take a picture and your meal is logged.' },
          superpower: { title: 'No Hidden Subscriptions or Ads', subtitle: 'Transparent pricing with all core calorie features free forever.' },
          cta: { title: 'Transform Your Relationship with Food', subtitle: 'Get started today with zero restrictions or extreme rules.' }
        }
      ],
      'playful-vibrant': [
        {
          hook: { title: 'Healthy Eating Made Delicious!', subtitle: 'Track colorful meals, discover tasty recipes, and feel fantastic.' },
          pain: { title: 'Say Goodbye to Calorie Counting Stress', subtitle: 'Fun visual rings turn good nutrition into an uplifting daily game.' },
          feature: { title: 'Collect Healthy Eating Badges', subtitle: 'Celebrate every balanced meal with joyful achievements and streaks.' },
          superpower: { title: 'Lightning Fast & Super Light', subtitle: 'Snap, log, and get back to enjoying your delicious food.' },
          cta: { title: 'Join the Delicious Journey', subtitle: 'Download free and make eating well your new favorite superpower.' }
        }
      ]
    }
  },

  education: {
    keywords: ['education', 'learn', 'course', 'study', 'school', 'language', 'student', 'teach', 'flashcard', 'vocabulary', 'exam', 'duolingo'],
    tones: {
      'high-converting': [
        {
          hook: { title: 'Master Any Skill in 5 Min/Day', subtitle: 'Bite-sized, gamified lessons engineered by cognitive memory scientists.' },
          pain: { title: 'Never Forget What You Study', subtitle: 'Spaced repetition algorithms lock concepts into long-term memory.' },
          feature: { title: 'AI Speech & Accent Feedback', subtitle: 'Real-time voice analysis refines your pronunciation on the spot.' },
          superpower: { title: 'Study 100% Offline Anywhere', subtitle: 'Download complete modules for uninterrupted study on flights.' },
          cta: { title: 'Unlock Your Full Potential', subtitle: 'Join over 50 million eager learners speaking confidently.' }
        }
      ],
      'apple-minimalist': [
        {
          hook: { title: 'Language. Mastered.', subtitle: 'Effortless micro-lessons designed for rapid conversational confidence.' },
          pain: { title: 'Focus on What Sticks.', subtitle: 'Curated vocabulary paths tailored to real-world conversations.' },
          feature: { title: 'Crystal Clear Audio Models.', subtitle: 'Native speaker recordings with pitch-perfect acoustic feedback.' },
          superpower: { title: 'Learn Without Distraction.', subtitle: 'Clean, distraction-free typography crafted for calm study.' },
          cta: { title: 'Begin Today.', subtitle: 'Download free on the App Store.' }
        }
      ],
      'feature-tech': [
        {
          hook: { title: 'Cognitive Memory Architecture Engine', subtitle: 'SuperMemo SM-18 spaced repetition scheduling algorithm.' },
          pain: { title: 'Real-Time Phoneme Audio Telemetry', subtitle: 'Fourier transform acoustic analysis detects exact pronunciation errors.' },
          feature: { title: 'Multi-Deck Flashcard Synthesis', subtitle: 'Instant Markdown and Anki deck import with bidirectional sync.' },
          superpower: { title: '100% Offline Local Neural Models', subtitle: 'On-device speech synthesis requires zero server connection.' },
          cta: { title: 'Accelerate Your Learning Rate', subtitle: 'The premier choice for polyglots, medical students, and scholars.' }
        }
      ],
      'social-proof': [
        {
          hook: { title: 'The #1 Rated Learning App', subtitle: 'Over 500,000 five-star reviews from verified fluent speakers.' },
          pain: { title: 'Why Millions Choose Our Method', subtitle: 'Named Best Educational App by Apple and Google Play globally.' },
          feature: { title: 'Join 50M+ Passionate Learners', subtitle: 'Compete on global leaderboards and celebrate daily milestones.' },
          superpower: { title: 'Backed by Cognitive Science', subtitle: 'Proven by university research to teach 2x faster than classrooms.' },
          cta: { title: 'Start Speaking Fluently Today', subtitle: 'Download now and master your first conversation in one week.' }
        }
      ],
      'problem-solution': [
        {
          hook: { title: 'Struggling to Learn a Language?', subtitle: 'Ditch boring grammar textbooks for real conversational mastery.' },
          pain: { title: 'Stop Forgetting Words You Studied', subtitle: 'Smart review reminders bring back words right before you forget them.' },
          feature: { title: 'Bite-Sized 5-Minute Lessons', subtitle: 'Fit learning into busy commutes, coffee breaks, and daily downtime.' },
          superpower: { title: 'No Annoying Paywalls or Pop-ups', subtitle: 'Core vocabulary courses are 100% free with zero interruptions.' },
          cta: { title: 'Start Speaking with Confidence', subtitle: 'Download now and begin your first fun lesson in 30 seconds.' }
        }
      ],
      'playful-vibrant': [
        {
          hook: { title: 'Learning Made Seriously Fun!', subtitle: 'Turn studying into an addictive adventure with quests and rewards.' },
          pain: { title: 'Say Goodbye to Boring Study Drills', subtitle: 'Level up your avatar, unlock hidden badges, and celebrate streaks.' },
          feature: { title: 'Compete on Friendly Leaderboards', subtitle: 'Challenge friends, climb leagues, and make learning a shared joy.' },
          superpower: { title: 'Super Smooth and Offline-Ready', subtitle: 'Practice anywhere, from sunny parks to airplane rides.' },
          cta: { title: 'Join the Learning Party Today', subtitle: 'Tap to start your fun quest toward fluency right away.' }
        }
      ]
    }
  },

  habits: {
    keywords: ["habit", "habits", "streak", "streaks", "routine", "discipline", "daily goals", "atomic"],
    tones: {
      "high-converting": [
        {
          hook: { title: "Build Habits That Actually Stick", subtitle: "Science-based habit stacking and streak tracking that changes behavior." },
          pain: { title: "Never Break the Chain", subtitle: "Gentle smart nudges and flexible recovery days keep your momentum alive." },
          feature: { title: "Visual Consistency Heatmaps", subtitle: "Celebrate daily wins with GitHub-style consistency matrices." },
          superpower: { title: "100% Offline & Private", subtitle: "Track personal habits without an account or cloud tracking." },
          cta: { title: "Start Your 30-Day Streak", subtitle: "Join over 750,000 people achieving lasting lifestyle changes." }
        }
      ],
      "apple-minimalist": [
        {
          hook: { title: "Habits. In Rhythm.", subtitle: "A quiet companion for building intentional daily routines." },
          pain: { title: "Small Steps Daily.", subtitle: "Focus on one positive action at a time with calm clarity." },
          feature: { title: "Elegant Progress Rings.", subtitle: "Subtle visual milestones that reward consistent progress." },
          superpower: { title: "Private by Design.", subtitle: "Your personal routines remain strictly confidential on-device." },
          cta: { title: "Begin Today.", subtitle: "Download free on the App Store." }
        }
      ],
      "feature-tech": [
        {
          hook: { title: "Behavioral Momentum Telemetry", subtitle: "Markov chain predictive analytics for habit retention and friction." },
          pain: { title: "Zero-Latency Interactive Widgets", subtitle: "Lock screen and Home screen widgets for sub-second habit logging." },
          feature: { title: "Habit Stacking Dependency Graphs", subtitle: "Link trigger cues to reward routines with algorithmic scheduling." },
          superpower: { title: "Local SQLite Architecture", subtitle: "Full offline durability with instant JSON/CSV habit exports." },
          cta: { title: "Systematize Your Life", subtitle: "The ultimate tool for high performers and habit trackers." }
        }
      ],
      "social-proof": [
        {
          hook: { title: "The #1 Rated Habit Tracker", subtitle: "Loved by 1M+ streak builders with a 4.9-star average rating." },
          pain: { title: "Why Habit Builders Love Us", subtitle: "Featured as Apple Best of the Year and Google Play Editors Choice." },
          feature: { title: "Over 10 Million Completed Streaks", subtitle: "Be part of a thriving global community transforming their lives." },
          superpower: { title: "Built on Behavioral Science", subtitle: "Engineered in partnership with leading habit researchers." },
          cta: { title: "Claim Your Habit Pass", subtitle: "Start your first transformative streak free today." }
        }
      ],
      "problem-solution": [
        {
          hook: { title: "Tired of Dropping Good Habits?", subtitle: "Turn good intentions into automatic daily habits in just 21 days." },
          pain: { title: "Stop Quitting After Day 3", subtitle: "Adaptive streak repair prevents all-or-nothing burnout." },
          feature: { title: "Effortless One-Tap Check-Ins", subtitle: "Log habits in seconds from your lock screen without opening the app." },
          superpower: { title: "Zero Spam, Zero Guilt", subtitle: "Supportive, positive reinforcement with no aggressive notifications." },
          cta: { title: "Transform Your Routine Today", subtitle: "Choose your first keystone habit and start building momentum." }
        }
      ],
      "playful-vibrant": [
        {
          hook: { title: "Make Daily Habits a Game!", subtitle: "Level up your daily routine with fun streak pets, badges, and confetti." },
          pain: { title: "Say Goodbye to Boring Checklists", subtitle: "Every completed habit earns points, unlocks rewards, and boosts your mood." },
          feature: { title: "Hatch Your Cute Habit Companion", subtitle: "Keep streaks alive to watch your virtual companion thrive and grow." },
          superpower: { title: "Super Fun & Friendly", subtitle: "Designed to make personal growth an uplifting, joyful daily ritual." },
          cta: { title: "Start Playing Today", subtitle: "Tap to begin your exciting habit adventure right now." }
        }
      ]
    }
  },

  ai: {
    keywords: ["ai", "gpt", "llm", "chatgpt", "bot", "assistant", "prompt", "generate", "copilot", "smart", "claude", "gemini", "intelligence"],
    tones: {
      "high-converting": [
        {
          hook: { title: "Supercharge Your Intelligence", subtitle: "Your personal AI companion for writing, research, brainstorming, and code." },
          pain: { title: "Instant Answers with Real Sources", subtitle: "Deep synthesis across live knowledge in under two seconds." },
          feature: { title: "Generate Masterful Content & Code", subtitle: "From complex analysis to creative writing with just one prompt." },
          superpower: { title: "Private On-Device Processing", subtitle: "Your personal prompts and confidential files never train public models." },
          cta: { title: "Unlock Superhuman Speed", subtitle: "Join over 1 million professionals multiplying their daily output." }
        }
      ],
      "apple-minimalist": [
        {
          hook: { title: "Intelligence. Reimagined.", subtitle: "A fast, elegant AI interface designed for deep creative focus." },
          pain: { title: "Answers in an Instant.", subtitle: "Clear, beautifully formatted responses without latency." },
          feature: { title: "Natural Thought Partner.", subtitle: "Seamlessly brainstorm, edit documents, and explore complex topics." },
          superpower: { title: "Private by Default.", subtitle: "Zero data retention. Your conversations remain confidential." },
          cta: { title: "Experience It Today.", subtitle: "Download free on the App Store." }
        }
      ],
      "feature-tech": [
        {
          hook: { title: "Pro-Grade Multi-Model AI Engine", subtitle: "Unified interface for Claude 3.7, GPT-4o, and DeepSeek R1 reasoning." },
          pain: { title: "Sub-200ms Token Generation", subtitle: "Stream responses with syntax highlighting, markdown, and LaTeX math." },
          feature: { title: "Local Vector Retrieval Engine", subtitle: "Chat with multi-gigabyte PDF archives and codebase repositories." },
          superpower: { title: "Bring Your Own API Key", subtitle: "Direct-to-provider routing with zero markup and zero logging." },
          cta: { title: "Supercharge Your Workflow", subtitle: "The ultimate workbench for developers, writers, and power users." }
        }
      ],
      "social-proof": [
        {
          hook: { title: "The #1 Rated AI Assistant", subtitle: "Over 100,000 five-star reviews from top researchers and creators." },
          pain: { title: "Why Top Innovators Switched", subtitle: "Voted Best AI Utility by developers and technology leaders globally." },
          feature: { title: "Over 50 Million Queries Solved", subtitle: "Trusted by students, founders, and executives in 120 countries." },
          superpower: { title: "Enterprise-Grade Security Standards", subtitle: "SOC-2 audited security protecting your proprietary queries." },
          cta: { title: "Start Free in Seconds", subtitle: "Download now and experience next-generation intelligence today." }
        }
      ],
      "problem-solution": [
        {
          hook: { title: "Stuck on a Blank Page?", subtitle: "Beat writer block and draft polished documents 10x faster." },
          pain: { title: "Stop Wasting Hours on Research", subtitle: "Get accurate, structured summaries of dense articles and papers." },
          feature: { title: "Intelligent Document Analysis", subtitle: "Upload complex contracts and PDFs for instant plain-English breakdowns." },
          superpower: { title: "No Creepy Data Profiling", subtitle: "Transparent privacy policy with complete conversation deletion." },
          cta: { title: "Supercharge Your Day Now", subtitle: "Ask your first question free in under 30 seconds." }
        }
      ],
      "playful-vibrant": [
        {
          hook: { title: "Your Fun AI Best Friend!", subtitle: "Chat, brainstorm wild ideas, and write creative stories together." },
          pain: { title: "Instant Answers to Any Question", subtitle: "Ask anything from trivia and recipes to travel plans with joyful ease." },
          feature: { title: "Create Fun Art & Stories", subtitle: "Turn quick ideas into illustrated adventures and funny poems." },
          superpower: { title: "Family-Friendly and Safe", subtitle: "Wholesome, safe AI designed for fun and curiosity at any age." },
          cta: { title: "Start Chatting Now!", subtitle: "Tap to meet your clever new digital companion today." }
        }
      ]
    }
  },

  photo: {
    keywords: ["photo", "video", "editor", "camera", "filters", "aesthetic", "reel", "cut", "retouch", "cinematic", "presets", "effects"],
    tones: {
      "high-converting": [
        {
          hook: { title: "Pro-Grade Photo & Video Editor", subtitle: "Transform ordinary mobile shots into breathtaking cinematic masterpieces." },
          pain: { title: "One-Tap AI Magic Retouch", subtitle: "Instantly remove background clutter and optimize skin tones naturally." },
          feature: { title: "100+ Authentic Film Emulations", subtitle: "Kodak, Portra, and vintage 35mm grain curves calibrated by colorists." },
          superpower: { title: "Full Resolution Lossless Export", subtitle: "Export uncompressed 4K ProRes video and RAW photos with zero loss." },
          cta: { title: "Create Breathtaking Visuals", subtitle: "Join over 2 million creators and visual artists leveling up their feed." }
        }
      ],
      "apple-minimalist": [
        {
          hook: { title: "Visuals. Perfected.", subtitle: "A refined darkroom studio designed for calm, precise creativity." },
          pain: { title: "Effortless Color Grading.", subtitle: "Intuitive tone curves and HSL sliders that respond instantly." },
          feature: { title: "Subtle Cinematic Presets.", subtitle: "Handcrafted color profiles that elevate your photography naturally." },
          superpower: { title: "RAW Processing Engine.", subtitle: "Full dynamic range latitude directly on your mobile device." },
          cta: { title: "Begin Creating Today.", subtitle: "Available free on the App Store." }
        }
      ],
      "feature-tech": [
        {
          hook: { title: "Metal-Accelerated RAW Pipeline", subtitle: "Sub-16ms 60fps color grading with full 16-bit float color precision." },
          pain: { title: "Full HSL & Tone Curve Matrix", subtitle: "Parametric color wheel grading with luminance masking and split toning." },
          feature: { title: "Non-Destructive Layer Architecture", subtitle: "Unlimited undo history with instant batch preset synchronization." },
          superpower: { title: "100% On-Device GPU Rendering", subtitle: "Zero cloud compression. Real-time ProRes 422 HQ scrubbing." },
          cta: { title: "Elevate Your Creative Workflow", subtitle: "The choice tool for professional commercial photographers." }
        }
      ],
      "social-proof": [
        {
          hook: { title: "The #1 Rated Photo Editor", subtitle: "Featured by Apple as App of the Day and loved by 2M+ photographers." },
          pain: { title: "Why Top Influencers Switched", subtitle: "Create the viral signature look that stands out in crowded feeds." },
          feature: { title: "Over 100 Million Edits Created", subtitle: "An inspiring community of visual storytellers and filmmakers." },
          superpower: { title: "Industry-Standard Color Science", subtitle: "Developed in collaboration with Hollywood post-production colorists." },
          cta: { title: "Claim Your Studio Pass", subtitle: "Download now and start editing your photos like a pro." }
        }
      ],
      "problem-solution": [
        {
          hook: { title: "Tired of Complicated Photo Apps?", subtitle: "Get editorial magazine quality with simple, intuitive sliders." },
          pain: { title: "Stop Ruining Great Moments", subtitle: "Fix dark shadows, harsh lighting, and blurry shots in one tap." },
          feature: { title: "Instant Smart Auto-Enhance", subtitle: "AI balances exposure and color contrast without over-saturating." },
          superpower: { title: "Zero Ads, Zero Watermarks", subtitle: "Save high-resolution images cleanly without annoying watermarks." },
          cta: { title: "Make Every Shot Stunning", subtitle: "Download free and turn your camera roll into pure art." }
        }
      ],
      "playful-vibrant": [
        {
          hook: { title: "Make Your Photos Pop!", subtitle: "Add sparkle, aesthetic stickers, retro film glow, and bright fun filters." },
          pain: { title: "Tap, Edit, and Share!", subtitle: "Super easy tools that make editing your favorite memories pure delight." },
          feature: { title: "Trendsetting Collage Layouts", subtitle: "Mix snapshots into aesthetic moodboards and photo dumps effortlessly." },
          superpower: { title: "Fast, Lightweight & Smooth", subtitle: "Save photos in an instant and share with your friends." },
          cta: { title: "Jump into the Studio!", subtitle: "Start editing now and show the world your unique style." }
        }
      ]
    }
  },

  travel: {
    keywords: ["travel", "flight", "trip", "hotel", "vacation", "itinerary", "guide", "destination", "airline", "booking", "explore", "passport"],
    tones: {
      "high-converting": [
        {
          hook: { title: "Explore the World for Less", subtitle: "Unlock secret airline fares, boutique villas, and curated scenic escapes." },
          pain: { title: "AI Price Drop Radar", subtitle: "Know the exact moment to book with 95% price drop accuracy." },
          feature: { title: "All Itineraries in One Place", subtitle: "Offline boarding passes, hotel vouchers, and live gate change alerts." },
          superpower: { title: "100% Offline Travel Wallet", subtitle: "Access tickets, directions, and maps without foreign data roaming." },
          cta: { title: "Your Next Adventure Awaits", subtitle: "Join over 1 million globetrotters exploring with total confidence." }
        }
      ],
      "apple-minimalist": [
        {
          hook: { title: "Travel. Simplified.", subtitle: "An elegant, calm travel companion for every stage of your trip." },
          pain: { title: "Effortless Coordination.", subtitle: "Boarding passes, reservations, and maps gathered in pure clarity." },
          feature: { title: "Smart Timelines.", subtitle: "Glanceable alerts keep you relaxed and ahead of your flight schedule." },
          superpower: { title: "Offline by Default.", subtitle: "Your full itinerary stays cached and ready at 35,000 feet." },
          cta: { title: "Begin Your Journey.", subtitle: "Available free on the App Store." }
        }
      ],
      "feature-tech": [
        {
          hook: { title: "Real-Time Aviation Telemetry Engine", subtitle: "Live ADS-B flight tracking, turbulence maps, and inbound aircraft radar." },
          pain: { title: "Sub-Minute Gate & Delay Alerts", subtitle: "Direct connection to FAA and Eurocontrol air traffic control data." },
          feature: { title: "Multi-Segment Itinerary Aggregation", subtitle: "Auto-parse confirmation emails from over 400 global carriers." },
          superpower: { title: "Offline Vector Geo-Mapping", subtitle: "Compressed worldwide terminal maps with zero cellular required." },
          cta: { title: "Level Up Your Travel Routine", subtitle: "The definitive travel companion for frequent business flyers." }
        }
      ],
      "social-proof": [
        {
          hook: { title: "The #1 Rated Travel App", subtitle: "Rated 4.9 stars across 90,000 reviews by travelers in 180 countries." },
          pain: { title: "Why 1M+ Explorers Switched", subtitle: "Voted Best Travel Companion by leading international travel magazines." },
          feature: { title: "Saved Travelers Over $50M", subtitle: "Beat surge pricing and travel smarter with an expert community." },
          superpower: { title: "Bank-Grade Encryption", subtitle: "Your passport and flight records are protected by local encryption." },
          cta: { title: "Start Exploring Today", subtitle: "Download free and unlock exclusive travel perks worldwide." }
        }
      ],
      "problem-solution": [
        {
          hook: { title: "Tired of Travel Chaos?", subtitle: "Say goodbye to scattered confirmation emails and missed connections." },
          pain: { title: "Never Scramble for a Ticket Again", subtitle: "Every confirmation number, gate change, and address in one spot." },
          feature: { title: "Instant Live Flight Radar", subtitle: "Get notified of gate changes before the airport monitors update." },
          superpower: { title: "Works Everywhere Without Data", subtitle: "Zero roaming stress. Open your boarding pass and hotel info offline." },
          cta: { title: "Travel with Total Peace of Mind", subtitle: "Add your next trip in 30 seconds and travel stress-free." }
        }
      ],
      "playful-vibrant": [
        {
          hook: { title: "Pack Your Bags and Smile!", subtitle: "Your joyful travel buddy for unforgettable adventures and road trips." },
          pain: { title: "Say Goodbye to Flight Stress", subtitle: "Smooth countdowns and friendly alerts keep your spirits flying high." },
          feature: { title: "Collect Passport Stamps", subtitle: "Earn digital pins and badges for every country and city you visit." },
          superpower: { title: "Works Offline Anywhere", subtitle: "Ready whenever wanderlust calls, from sandy beaches to mountaintops." },
          cta: { title: "Start Your Adventure Now", subtitle: "Tap to begin planning your dream getaway today." }
        }
      ]
    }
  },

  utilities: {
    keywords: ["utility", "utilities", "scanner", "pdf", "tools", "documents", "flashlight", "calculator", "files", "converter"],
    tones: {
      "high-converting": [
        {
          hook: { title: "The Ultimate Pocket Utility Toolkit", subtitle: "Scan, sign, convert, and organize documents with lightning speed." },
          pain: { title: "No Bulky Desktop Scanner Needed", subtitle: "Auto-detect document edges, remove shadows, and straighten text in 1 second." },
          feature: { title: "OCR Text Recognition in 100+ Languages", subtitle: "Extract editable text and tables from receipts and contracts instantly." },
          superpower: { title: "100% Offline & Private Security", subtitle: "Your sensitive tax and legal documents never leave your phone." },
          cta: { title: "Scan Your First Document Free", subtitle: "Join over 2 million people keeping life organized and paperless." }
        }
      ],
      "apple-minimalist": [
        {
          hook: { title: "Scanner. Perfected.", subtitle: "Pristine document capture with crisp contrast and effortless clarity." },
          pain: { title: "Instant Border Detection.", subtitle: "Point your camera and watch edges snap into place automatically." },
          feature: { title: "Crystal-Clear PDF Exports.", subtitle: "Binarized black-and-white mode optimized for high legibility." },
          superpower: { title: "Local-First Privacy.", subtitle: "No account required. All files stored strictly on your device." },
          cta: { title: "Begin Scanning Today.", subtitle: "Available free on the App Store." }
        }
      ],
      "feature-tech": [
        {
          hook: { title: "Industrial-Grade Document Engine", subtitle: "Bilinear perspective correction, threshold filtering, and multi-page stitching." },
          pain: { title: "Sub-100ms On-Device OCR Pipeline", subtitle: "Apple Vision Neural Engine extracts text, tables, and barcodes locally." },
          feature: { title: "PDF/A Archival Standard Export", subtitle: "Compress scans up to 90% without sacrificing text readability." },
          superpower: { title: "AirDrop and WebDAV Direct Sync", subtitle: "Zero third-party cloud reliance. Direct local network transfers." },
          cta: { title: "Upgrade Your Utility Arsenal", subtitle: "The gold standard for legal counsel, accountants, and engineers." }
        }
      ],
      "social-proof": [
        {
          hook: { title: "The #1 Rated Document Utility", subtitle: "Over 120,000 five-star reviews from verified professionals worldwide." },
          pain: { title: "Why 2M+ Users Ditched Old Scanners", subtitle: "Featured as App of the Day and Top Business Utility on the App Store." },
          feature: { title: "Over 50 Million Documents Scanned", subtitle: "Trusted by Fortune 500 teams and solo practitioners alike." },
          superpower: { title: "Zero-Knowledge Encryption", subtitle: "Biometric FaceID app lock protects your confidential files." },
          cta: { title: "Go 100% Paperless Today", subtitle: "Download now and scan your first document in seconds." }
        }
      ],
      "problem-solution": [
        {
          hook: { title: "Lost in a Pile of Paperwork?", subtitle: "Digitize receipts, contracts, and bills in seconds and clear your desk." },
          pain: { title: "Stop Paying for Overpriced Scanners", subtitle: "Turn your smartphone camera into a multi-thousand-dollar document scanner." },
          feature: { title: "Search Inside Any Scanned Document", subtitle: "Find any receipt or contract in seconds with instant keyword search." },
          superpower: { title: "No Watermarks, No Subscriptions", subtitle: "Export clean, full-resolution PDFs without annoying forced watermarks." },
          cta: { title: "Clear Your Paper Clutter Now", subtitle: "Download free and digitize your paperwork today." }
        }
      ],
      "playful-vibrant": [
        {
          hook: { title: "Scan, Sign, Done in Seconds!", subtitle: "The fastest, most delightful pocket tool for everyday documents." },
          pain: { title: "Say Goodbye to Paper Headaches", subtitle: "Point, snap, and watch documents clean up like magic with a smile." },
          feature: { title: "One-Tap Sharing Anywhere", subtitle: "Send signed PDFs to email, WhatsApp, or cloud drive with ease." },
          superpower: { title: "Super Light and Instant", subtitle: "Opens in a flash with zero wait times or battery drain." },
          cta: { title: "Start Scanning with Joy", subtitle: "Tap to make paperwork fun and effortless today." }
        }
      ]
    }
  },
};

/**
 * Detect domain from free-form user description using keyword heuristics
 */
export function detectAsoDomain(query?: string): string {
  if (!query || !query.trim()) return 'universal';
  
  const text = query.toLowerCase();
  
  // Score matches across each domain
  let bestDomain = 'universal';
  let bestScore = 0;
  
  for (const [domainKey, config] of Object.entries(ASO_DOMAINS)) {
    let score = 0;
    for (const kw of config.keywords) {
      if (text.includes(kw)) {
        // Longer keyword matches earn higher weight
        score += kw.length > 5 ? 3 : 2;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestDomain = domainKey;
    }
  }
  
  return bestScore >= 2 ? bestDomain : 'universal';
}

/**
 * Universal high-converting copy sets when no specialized niche is detected
 */
export const UNIVERSAL_ASO_TONES: Record<AsoTone, AsoStoryArc[]> = {
  'high-converting': [
    {
      hook: { title: 'Experience the Ultimate App', subtitle: 'Designed from the ground up to elevate your daily routine.' },
      pain: { title: 'End Everyday Friction', subtitle: 'Smart automated workflows eliminate repetitive manual steps.' },
      feature: { title: 'Powerful Features, Simple Design', subtitle: 'Everything you need with zero clutter or complicated setup.' },
      superpower: { title: '100% Private & Blazing Fast', subtitle: 'Bank-grade encryption, zero tracking, and complete offline access.' },
      cta: { title: 'Get Started in Seconds', subtitle: 'Join millions of happy users enjoying a better experience today.' }
    },
    {
      hook: { title: 'The Smarter Way Forward', subtitle: 'Elevate your daily habits with clarity, speed, and intelligence.' },
      pain: { title: 'Say Goodbye to Complexity', subtitle: 'Intuitive design that works seamlessly from the very first tap.' },
      feature: { title: 'Real-Time Insights & Analytics', subtitle: 'Track your personal progress with beautiful, high-clarity metrics.' },
      superpower: { title: 'Sub-50ms Response Speed', subtitle: 'Instant responsiveness with zero lag or annoying spinners.' },
      cta: { title: 'Unlock Your Next Level', subtitle: 'Download free today and see the difference immediately.' }
    }
  ],
  'apple-minimalist': [
    {
      hook: { title: 'Simply Powerful.', subtitle: 'Focus on what truly matters with zero distractions.' },
      pain: { title: 'Pure Focus.', subtitle: 'An uncluttered workspace crafted for calm productivity.' },
      feature: { title: 'Precision Craft.', subtitle: 'Every interaction designed for natural, fluid delight.' },
      superpower: { title: 'Private by Design.', subtitle: 'On-device intelligence. Your data stays strictly yours.' },
      cta: { title: 'Begin Today.', subtitle: 'Download free on the App Store.' }
    }
  ],
  'feature-tech': [
    {
      hook: { title: 'Built for Power Users', subtitle: 'Lightning-fast performance with deep customization and pro tools.' },
      pain: { title: 'Automate Everything', subtitle: 'Sub-50ms response times with smart keyboard shortcuts and widgets.' },
      feature: { title: 'Seamless Multi-Device Sync', subtitle: 'Instant two-way sync across phone, tablet, and desktop.' },
      superpower: { title: '100% Offline & Encrypted', subtitle: 'Zero cloud dependencies required. Works anywhere in the world.' },
      cta: { title: 'Level Up Your Toolkit', subtitle: 'Get the pro edition today. Free forever for individuals.' }
    }
  ],
  'social-proof': [
    {
      hook: { title: 'Loved by 1M+ Users', subtitle: 'See why everyone is switching to the highest rated app in its category.' },
      pain: { title: 'Award-Winning Experience', subtitle: 'Featured by Apple and Google Play as App of the Day and Editors\' Choice.' },
      feature: { title: 'Join a Global Community', subtitle: 'Connect with passionate thinkers, share progress, and grow together.' },
      superpower: { title: 'Trusted by Industry Leaders', subtitle: 'Independently audited security with over 50,000 five-star reviews.' },
      cta: { title: 'Claim Your Welcome Perks', subtitle: 'Join millions of happy users today. Free to download.' }
    }
  ],
  'problem-solution': [
    {
      hook: { title: 'Stop Struggling with Chaos', subtitle: 'The clear, frustration-free solution you have been waiting for.' },
      pain: { title: 'Save Hours Every Week', subtitle: 'Cut out repetitive manual work with intelligent automated guidance.' },
      feature: { title: 'Total Peace of Mind', subtitle: 'Smart notifications and safety checks ensure you never slip up.' },
      superpower: { title: 'Zero Risk, Zero Hidden Fees', subtitle: 'Transparent privacy policy, no predatory ads, and full data control.' },
      cta: { title: 'Transform Your Routine Now', subtitle: 'Start free in under 60 seconds with zero credit card required.' }
    }
  ],
  'playful-vibrant': [
    {
      hook: { title: 'Your Life, Leveled Up!', subtitle: 'Bring vibrant energy, fun interactions, and joy back to your daily routine.' },
      pain: { title: 'Tap, Swipe, Enjoy!', subtitle: 'Playful animations and delightful sounds make every action a breeze.' },
      feature: { title: 'Celebrate Every Win!', subtitle: 'Unlock cool achievements, custom avatar themes, and streak badges.' },
      superpower: { title: 'Safe, Clean & Joyful', subtitle: '100% private, family-safe, and designed with genuine care.' },
      cta: { title: 'Jump in and Have Fun!', subtitle: 'Download now and start smiling right away.' }
    }
  ]
};

/**
 * Intelligent grammatical synthesis for custom or long-tail user keywords
 */
export function synthesizeCustomAsoStoryArc(
  rawKeywords: string[],
  tone: AsoTone = 'high-converting',
  variationIndex: number = 0
): AsoStoryArc {
  const kw1 = rawKeywords[0] || 'App';
  const kw2 = rawKeywords[1] || kw1;

  // Clean entity names: e.g. "Sleep Tracker" -> entity = "Sleep Tracker", subject = "Sleep"
  const cleanEntity = kw1.replace(/^(a|an|the)\s+/i, '').trim();
  const cleanSecond = kw2.replace(/^(a|an|the)\s+/i, '').trim();

  switch (tone) {
    case 'apple-minimalist':
      return {
        hook: { title: `${cleanEntity}. Perfected.`, subtitle: 'A calm, refined experience crafted for clarity and focus.' },
        pain: { title: 'Pure Focus.', subtitle: 'No cluttered menus or unnecessary noise. Just what matters.' },
        feature: { title: `Effortless ${cleanSecond}.`, subtitle: 'Fluid micro-interactions designed to feel natural and immediate.' },
        superpower: { title: 'Private by Design.', subtitle: 'On-device intelligence keeps your personal data strictly yours.' },
        cta: { title: 'Begin Today.', subtitle: 'Available free on the App Store.' }
      };

    case 'feature-tech':
      return {
        hook: { title: `Pro-Grade ${cleanEntity} Engine`, subtitle: `Advanced telemetry and precision tools engineered for modern ${cleanSecond} workflows.` },
        pain: { title: `Automate Your ${cleanEntity}`, subtitle: 'Sub-50ms response times with smart keyboard shortcuts and widgets.' },
        feature: { title: `Deep Real-Time ${cleanSecond} Insights`, subtitle: 'Instant two-way offline synchronization and granular data exports.' },
        superpower: { title: '100% Offline & Encrypted', subtitle: 'Zero cloud dependencies required. Works anywhere in the world.' },
        cta: { title: 'Upgrade Your Toolkit', subtitle: 'Download today. Free forever for individuals.' }
      };

    case 'social-proof':
      return {
        hook: { title: `The #1 Rated ${cleanEntity} App`, subtitle: 'Rated 4.9 stars by over 100,000 verified users globally.' },
        pain: { title: `Why Everyone Is Switching`, subtitle: 'Featured as App of the Day and Editors\' Choice worldwide.' },
        feature: { title: `Join 500,000+ Mastering ${cleanSecond}`, subtitle: 'Connect with a passionate community and stay motivated every day.' },
        superpower: { title: 'Trusted by Top Industry Leaders', subtitle: 'Independently audited security with bank-grade privacy standards.' },
        cta: { title: 'Claim Your Welcome Perks', subtitle: 'Download now to join millions of happy users today.' }
      };

    case 'problem-solution':
      return {
        hook: { title: `Tired of Complex ${cleanEntity}?`, subtitle: `Finally, an effortless way to master your ${cleanSecond} without the headache.` },
        pain: { title: `No More Daily Frustrations`, subtitle: 'Cut out repetitive manual work with intelligent automated guidance.' },
        feature: { title: `Simple ${cleanSecond} Mastery`, subtitle: 'Clear visual paths and smart checks ensure you never slip up.' },
        superpower: { title: 'Zero Risk, Zero Hidden Fees', subtitle: 'Transparent privacy policy, zero predatory ads, and full data control.' },
        cta: { title: 'Fix Your Routine Today', subtitle: 'Start free in under 60 seconds with zero credit card required.' }
      };

    case 'playful-vibrant':
      return {
        hook: { title: `Meet Your Favorite ${cleanEntity}!`, subtitle: 'Bring vibrant energy, fun interactions, and joy back to your routine.' },
        pain: { title: 'Tap, Swipe, Enjoy!', subtitle: 'Delightful haptics and animations make every action feel amazing.' },
        feature: { title: `Celebrate Every ${cleanSecond} Win`, subtitle: 'Unlock cool achievements, streak badges, and fun rewards.' },
        superpower: { title: 'Safe, Clean & Joyful', subtitle: '100% private, family-safe, and designed with genuine care.' },
        cta: { title: 'Jump in and Have Fun!', subtitle: 'Download now and start smiling right away.' }
      };

    case 'high-converting':
    default:
      if (variationIndex % 2 === 1) {
        return {
          hook: { title: `Master Your ${cleanEntity} Effortlessly`, subtitle: `The smarter, high-impact tool to elevate your daily ${cleanSecond} routine.` },
          pain: { title: `Eliminate Everyday Friction`, subtitle: 'Instant one-tap workflows replace chaotic, multi-step processes.' },
          feature: { title: `Smart Real-Time ${cleanSecond} Metrics`, subtitle: 'Visualize your progress with beautiful, high-clarity analytics.' },
          superpower: { title: '100% Private & Blazing Fast', subtitle: 'Bank-grade encryption, zero tracking, and complete offline access.' },
          cta: { title: `Start Your ${cleanEntity} Journey`, subtitle: 'Download now to experience the next level of excellence.' }
        };
      }
      return {
        hook: { title: `The Ultimate ${cleanEntity} Companion`, subtitle: `Take control of your ${cleanSecond} with powerful, distraction-free tools.` },
        pain: { title: `Say Goodbye to Guesswork`, subtitle: 'Intelligent automation helps you focus on what actually moves the needle.' },
        feature: { title: `Track & Optimize ${cleanSecond}`, subtitle: 'Visual charts, automated tags, and smart reminders keep you on track.' },
        superpower: { title: '100% Offline & Private', subtitle: 'Zero cloud requirement. Your personal data never leaves your device.' },
        cta: { title: 'Get Started in Seconds', subtitle: 'Join thousands of satisfied users achieving their peak potential today.' }
      };
  }
}
