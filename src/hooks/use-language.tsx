"use client";

import React, { useState, useEffect, createContext, useContext } from "react";

export type Language = "en" | "sw" | "ha" | "yo";

interface Translations {
  [key: string]: {
    [K in Language]: string;
  };
}

const translations: Translations = {
  // Common
  "common.loading": {
    en: "Loading...",
    sw: "Inapakia...",
    ha: "Ana loda...",
    yo: "N gbe...",
  },
  "common.error": {
    en: "Error",
    sw: "Hitilafu",
    ha: "Kuskure",
    yo: "Aṣiṣe",
  },
  "common.success": {
    en: "Success",
    sw: "Imefanikiwa",
    ha: "Nasara",
    yo: "Aṣeyọri",
  },
  "common.cancel": {
    en: "Cancel",
    sw: "Ghairi",
    ha: "Soke",
    yo: "Fagilee",
  },
  "common.continue": {
    en: "Continue",
    sw: "Endelea",
    ha: "Ci gaba",
    yo: "Tẹsiwaju",
  },
  "common.back": {
    en: "Back",
    sw: "Rudi",
    ha: "Komawa",
    yo: "Pada",
  },
  "common.next": {
    en: "Next",
    sw: "Ifuatayo",
    ha: "Na gaba",
    yo: "Atẹle",
  },
  "common.submit": {
    en: "Submit",
    sw: "Wasilisha",
    ha: "Aikawa",
    yo: "Fi silẹ",
  },

  // Crypto Offramp
  "offramp.title": {
    en: "Crypto to Fiat Offramp",
    sw: "Ubadilishaji wa Crypto kuwa Pesa za Kimataifa",
    ha: "Musayar Crypto zuwa Kudin Kasa",
    yo: "Iyipada Crypto si Owo Orile-ede",
  },
  "offramp.description": {
    en: "Convert your cryptocurrency to local currency with M-Pesa and bank transfers",
    sw: "Badilisha cryptocurrency yako kuwa pesa za ndani kupitia M-Pesa na uhamisho wa benki",
    ha: "Canza cryptocurrency dinku zuwa kudin gida ta hanyar M-Pesa da canja wurin banki",
    yo: "Yi iyipada cryptocurrency rẹ si owo ibilẹ pẹlu M-Pesa ati gbigbe banki",
  },
  "offramp.selectCrypto": {
    en: "Select Cryptocurrency",
    sw: "Chagua Cryptocurrency",
    ha: "Zaɓi Cryptocurrency",
    yo: "Yan Cryptocurrency",
  },
  "offramp.amount": {
    en: "Amount to Convert",
    sw: "Kiasi cha Kubadilisha",
    ha: "Adadin da za a canza",
    yo: "Iwọn lati Yi pada",
  },
  "offramp.targetCurrency": {
    en: "Target Currency",
    sw: "Sarafu ya Lengo",
    ha: "Kudin da ake nufi",
    yo: "Owo ti o fẹ",
  },
  "offramp.exchangeRate": {
    en: "Exchange Rate",
    sw: "Kiwango cha Ubadilishaji",
    ha: "Kimar Musayar",
    yo: "Iwọn Paṣipaarọ",
  },
  "offramp.payoutMethod": {
    en: "Payout Method",
    sw: "Njia ya Malipo",
    ha: "Hanyar Biyan kuɗi",
    yo: "Ọna Isanwo",
  },
  "offramp.mpesaNumber": {
    en: "M-Pesa Phone Number",
    sw: "Nambari ya Simu ya M-Pesa",
    ha: "Lambar wayar M-Pesa",
    yo: "Nọmba fonu M-Pesa",
  },
  "offramp.bankAccount": {
    en: "Bank Account Number",
    sw: "Nambari ya Akaunti ya Benki",
    ha: "Lambar Asusun Banki",
    yo: "Nọmba Account Banki",
  },
  "offramp.transactionSummary": {
    en: "Transaction Summary",
    sw: "Muhtasari wa Muamala",
    ha: "Takaitaccen Ma'amala",
    yo: "Akojọ Iṣowo",
  },
  "offramp.startOfframp": {
    en: "Start Offramp",
    sw: "Anza Offramp",
    ha: "Fara Offramp",
    yo: "Bẹrẹ Offramp",
  },

  // KYC
  "kyc.title": {
    en: "KYC Verification",
    sw: "Uthibitisho wa KYC",
    ha: "Tabbatar da KYC",
    yo: "Ifijuutọ KYC",
  },
  "kyc.description": {
    en: "Complete your identity verification to access crypto offramp services",
    sw: "Maliza uthibitisho wa kitambulisho chako ili kupata huduma za offramp za crypto",
    ha: "Kammala tabbatar da ainihin ku don samun damar yin amfani da sabis na offramp na crypto",
    yo: "Pari ifijuutọ idanimọ rẹ lati wọle si awọn iṣẹ crypto offramp",
  },
  "kyc.personalInfo": {
    en: "Personal Information",
    sw: "Maelezo ya Kibinafsi",
    ha: "Bayanan Mutum",
    yo: "Alaye Ti ara ẹni",
  },
  "kyc.idVerification": {
    en: "ID Verification",
    sw: "Uthibitisho wa Kitambulisho",
    ha: "Tabbatar da ID",
    yo: "Ifijuutọ ID",
  },
  "kyc.financialInfo": {
    en: "Financial Information",
    sw: "Maelezo ya Kifedha",
    ha: "Bayanan Kudi",
    yo: "Alaye Owo",
  },
  "kyc.compliance": {
    en: "Compliance",
    sw: "Kufuata Sheria",
    ha: "Bin biyayya",
    yo: "Gbigbagbọ",
  },
  "kyc.firstName": {
    en: "First Name",
    sw: "Jina la Kwanza",
    ha: "Suna na Farko",
    yo: "Orukọ Akọkọ",
  },
  "kyc.lastName": {
    en: "Last Name",
    sw: "Jina la Mwisho",
    ha: "Suna na Ƙarshe",
    yo: "Orukọ Ikẹhin",
  },
  "kyc.dateOfBirth": {
    en: "Date of Birth",
    sw: "Tarehe ya Kuzaliwa",
    ha: "Ranar Haihuwa",
    yo: "Ọjọ ibi",
  },
  "kyc.nationality": {
    en: "Nationality",
    sw: "Uraia",
    ha: "Ƙasa",
    yo: "Orilẹ-ede",
  },
  "kyc.phoneNumber": {
    en: "Phone Number",
    sw: "Nambari ya Simu",
    ha: "Lambar Waya",
    yo: "Nọmba fonu",
  },
  "kyc.email": {
    en: "Email Address",
    sw: "Anwani ya Barua pepe",
    ha: "Adireshin Imel",
    yo: "Adirẹsi imeeli",
  },

  // Transaction History
  "history.title": {
    en: "Transaction History",
    sw: "Historia ya Miamala",
    ha: "Tarihin Ma'amala",
    yo: "Itan Iṣowo",
  },
  "history.description": {
    en: "View and manage your cryptocurrency transactions",
    sw: "Ona na usimamizi miamala yako ya cryptocurrency",
    ha: "Duba da gudanar da ma'amalolin cryptocurrency ku",
    yo: "Wo ati ṣakoso awọn iṣowo cryptocurrency rẹ",
  },
  "history.totalTransactions": {
    en: "Total Transactions",
    sw: "Jumla ya Miamala",
    ha: "Jimillar Ma'amala",
    yo: "Lapapọ Awọn iṣowo",
  },
  "history.completed": {
    en: "Completed",
    sw: "Imekamilika",
    ha: "An gama",
    yo: "Ti pari",
  },
  "history.totalVolume": {
    en: "Total Volume",
    sw: "Jumla ya Kiasi",
    ha: "Jimlar Girma",
    yo: "Lapapọ Iwọn",
  },
  "history.totalFees": {
    en: "Total Fees",
    sw: "Jumla ya Ada",
    ha: "Jimillar Kudade",
    yo: "Lapapọ Awọn idiyele",
  },
  "history.search": {
    en: "Search by ID, reference, or hash...",
    sw: "Tafuta kwa ID, rejea, au hash...",
    ha: "Nema ta ID, reference, ko hash...",
    yo: "Wa nipa ID, itọkasi, tabi hash...",
  },
  "history.allStatus": {
    en: "All Status",
    sw: "Hali Zote",
    ha: "Dukan Matsayi",
    yo: "Gbogbo Ipo",
  },
  "history.allTypes": {
    en: "All Types",
    sw: "Aina Zote",
    ha: "Dukan Nau'i",
    yo: "Gbogbo Iru",
  },
  "history.allCurrencies": {
    en: "All Currencies",
    sw: "Sarafu Zote",
    ha: "Dukan Kuɗaɗe",
    yo: "Gbogbo Owo",
  },
  "history.noTransactions": {
    en: "No transactions found",
    sw: "Hakuna miamala iliyopatikana",
    ha: "Ba a sami ma'amala ba",
    yo: "Ko si iṣowo ti a ri",
  },
  "history.adjustFilters": {
    en: "Try adjusting your filters or search query",
    sw: "Jaribu kubadilisha vichuja vyako au hoja ya utafutaji",
    ha: "Gwada gyara tacewa ko tambayar bincike",
    yo: "Gbiyanju ṣatunṣe awọn asẹ rẹ tabi ibeere wiwa",
  },

  // Languages
  "language.english": {
    en: "English",
    sw: "Kingereza",
    ha: "Turanci",
    yo: "Gẹẹsi",
  },
  "language.swahili": {
    en: "Swahili",
    sw: "Kiswahili",
    ha: "Swahili",
    yo: "Swahili",
  },
  "language.hausa": {
    en: "Hausa",
    sw: "Kihausa",
    ha: "Hausa",
    yo: "Hausa",
  },
  "language.yoruba": {
    en: "Yoruba",
    sw: "Kiyoruba",
    ha: "Yoruba",
    yo: "Yorùbá",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const createLanguageProvider = () => {
  const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguageState] = useState<Language>("en");

    useEffect(() => {
      const savedLanguage = localStorage.getItem("language") as Language;
      if (savedLanguage && ["en", "sw", "ha", "yo"].includes(savedLanguage)) {
        setLanguageState(savedLanguage);
      }
    }, []);

    const setLanguage = (newLanguage: Language) => {
      setLanguageState(newLanguage);
      localStorage.setItem("language", newLanguage);
    };

    const t = (key: string): string => {
      const translation = translations[key];
      if (!translation) {
        console.warn(`Translation missing for key: ${key}`);
        return key;
      }
      return translation[language] || translation.en || key;
    };

    return (
      <LanguageContext.Provider value={{ language, setLanguage, t }}>
        {children}
      </LanguageContext.Provider>
    );
  };

  return LanguageProvider;
};

export const LanguageProvider = createLanguageProvider();