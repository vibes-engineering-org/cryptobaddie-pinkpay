"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Checkbox } from "~/components/ui/checkbox";
import { Progress } from "~/components/ui/progress";

interface KYCData {
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
    phoneNumber: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
  };
  idVerification: {
    idType: string;
    idNumber: string;
    idFrontImage: File | null;
    idBackImage: File | null;
    selfieImage: File | null;
  };
  financialInfo: {
    occupation: string;
    employer: string;
    monthlyIncome: string;
    sourceOfFunds: string;
    expectedTransactionVolume: string;
  };
  compliance: {
    pepStatus: boolean;
    sanctionsCheck: boolean;
    termsAccepted: boolean;
    privacyPolicyAccepted: boolean;
  };
}

const COUNTRIES = [
  { code: "KE", name: "Kenya" },
  { code: "TZ", name: "Tanzania" },
  { code: "NG", name: "Nigeria" },
  { code: "UG", name: "Uganda" },
  { code: "RW", name: "Rwanda" },
];

const ID_TYPES = {
  KE: [
    { code: "national_id", name: "National ID" },
    { code: "passport", name: "Passport" },
    { code: "driving_license", name: "Driving License" },
  ],
  TZ: [
    { code: "national_id", name: "National ID" },
    { code: "passport", name: "Passport" },
    { code: "voter_id", name: "Voter ID" },
  ],
  NG: [
    { code: "national_id", name: "National Identity Card" },
    { code: "passport", name: "International Passport" },
    { code: "drivers_license", name: "Driver's License" },
    { code: "voters_card", name: "Permanent Voter's Card" },
  ],
};

const OCCUPATIONS = [
  "Employed - Private Sector",
  "Employed - Public Sector",
  "Self-Employed",
  "Business Owner",
  "Student",
  "Unemployed",
  "Retired",
  "Other",
];

const INCOME_RANGES = [
  "Under $500",
  "$500 - $1,000",
  "$1,000 - $2,500",
  "$2,500 - $5,000",
  "$5,000 - $10,000",
  "Over $10,000",
];

const SOURCE_OF_FUNDS = [
  "Salary/Employment",
  "Business Income",
  "Investment Returns",
  "Savings",
  "Gift/Inheritance",
  "Other",
];

export default function KYCCompliance() {
  const [currentStep, setCurrentStep] = useState(0);
  const [kycData, setKycData] = useState<KYCData>({
    personalInfo: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      nationality: "",
      phoneNumber: "",
      email: "",
      address: "",
      city: "",
      postalCode: "",
    },
    idVerification: {
      idType: "",
      idNumber: "",
      idFrontImage: null,
      idBackImage: null,
      selfieImage: null,
    },
    financialInfo: {
      occupation: "",
      employer: "",
      monthlyIncome: "",
      sourceOfFunds: "",
      expectedTransactionVolume: "",
    },
    compliance: {
      pepStatus: false,
      sanctionsCheck: false,
      termsAccepted: false,
      privacyPolicyAccepted: false,
    },
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "verified" | "rejected" | null>(null);

  const steps = [
    { id: 0, title: "Personal Information", description: "Basic personal details" },
    { id: 1, title: "ID Verification", description: "Identity document upload" },
    { id: 2, title: "Financial Information", description: "Income and source of funds" },
    { id: 3, title: "Compliance", description: "Terms and compliance checks" },
  ];

  const updatePersonalInfo = (field: keyof KYCData["personalInfo"], value: string) => {
    setKycData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const updateIdVerification = (field: keyof KYCData["idVerification"], value: string | File | null) => {
    setKycData(prev => ({
      ...prev,
      idVerification: { ...prev.idVerification, [field]: value }
    }));
  };

  const updateFinancialInfo = (field: keyof KYCData["financialInfo"], value: string) => {
    setKycData(prev => ({
      ...prev,
      financialInfo: { ...prev.financialInfo, [field]: value }
    }));
  };

  const updateCompliance = (field: keyof KYCData["compliance"], value: boolean) => {
    setKycData(prev => ({
      ...prev,
      compliance: { ...prev.compliance, [field]: value }
    }));
  };

  const handleFileUpload = (field: keyof KYCData["idVerification"], event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    updateIdVerification(field, file);
  };

  const isStepComplete = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        const { firstName, lastName, dateOfBirth, nationality, phoneNumber, email } = kycData.personalInfo;
        return firstName && lastName && dateOfBirth && nationality && phoneNumber && email;
      case 1:
        const { idType, idNumber, idFrontImage, selfieImage } = kycData.idVerification;
        return idType && idNumber && idFrontImage && selfieImage;
      case 2:
        const { occupation, monthlyIncome, sourceOfFunds } = kycData.financialInfo;
        return occupation && monthlyIncome && sourceOfFunds;
      case 3:
        const { termsAccepted, privacyPolicyAccepted } = kycData.compliance;
        return termsAccepted && privacyPolicyAccepted;
      default:
        return false;
    }
  };

  const getProgress = () => {
    const completedSteps = steps.filter((_, index) => isStepComplete(index)).length;
    return (completedSteps / steps.length) * 100;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate KYC processing
    setTimeout(() => {
      setIsSubmitting(false);
      setVerificationStatus("pending");
      alert("KYC application submitted successfully! You will receive an email notification once verification is complete.");
    }, 2000);
  };

  const availableIdTypes = kycData.personalInfo.nationality ? ID_TYPES[kycData.personalInfo.nationality as keyof typeof ID_TYPES] || [] : [];

  if (verificationStatus === "verified") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">KYC Verification Complete</CardTitle>
          <CardDescription>Your identity has been successfully verified</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Verification Successful</h3>
            <p className="text-muted-foreground">You can now access all offramp services</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (verificationStatus === "pending") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-orange-600">KYC Under Review</CardTitle>
          <CardDescription>We are processing your verification documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Under Review</h3>
            <p className="text-muted-foreground">Your KYC application is being processed. This typically takes 1-3 business days.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>KYC Verification</CardTitle>
          <CardDescription>
            Complete your identity verification to access crypto offramp services
          </CardDescription>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{Math.round(getProgress())}%</span>
            </div>
            <Progress value={getProgress()} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Step Navigation */}
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                currentStep === index
                  ? "bg-primary text-primary-foreground"
                  : isStepComplete(index)
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-muted hover:bg-muted/70"
              }`}
              onClick={() => setCurrentStep(index)}
            >
              <div className="flex items-center gap-2">
                {isStepComplete(index) && (
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                <div>
                  <div className="font-medium text-sm">{step.title}</div>
                  <div className="text-xs opacity-70">{step.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep].title}</CardTitle>
              <CardDescription>{steps[currentStep].description}</CardDescription>
            </CardHeader>
            <CardContent>
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={kycData.personalInfo.firstName}
                        onChange={(e) => updatePersonalInfo("firstName", e.target.value)}
                        placeholder="Enter first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={kycData.personalInfo.lastName}
                        onChange={(e) => updatePersonalInfo("lastName", e.target.value)}
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={kycData.personalInfo.dateOfBirth}
                        onChange={(e) => updatePersonalInfo("dateOfBirth", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nationality">Nationality</Label>
                      <Select
                        value={kycData.personalInfo.nationality}
                        onValueChange={(value) => updatePersonalInfo("nationality", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select nationality" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={kycData.personalInfo.phoneNumber}
                        onChange={(e) => updatePersonalInfo("phoneNumber", e.target.value)}
                        placeholder="+254712345678"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={kycData.personalInfo.email}
                        onChange={(e) => updatePersonalInfo("email", e.target.value)}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={kycData.personalInfo.address}
                      onChange={(e) => updatePersonalInfo("address", e.target.value)}
                      placeholder="Enter your full address"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={kycData.personalInfo.city}
                        onChange={(e) => updatePersonalInfo("city", e.target.value)}
                        placeholder="City"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postal">Postal Code</Label>
                      <Input
                        id="postal"
                        value={kycData.personalInfo.postalCode}
                        onChange={(e) => updatePersonalInfo("postalCode", e.target.value)}
                        placeholder="Postal code"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="idType">ID Type</Label>
                      <Select
                        value={kycData.idVerification.idType}
                        onValueChange={(value) => updateIdVerification("idType", value)}
                        disabled={!kycData.personalInfo.nationality}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select ID type" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableIdTypes.map((idType) => (
                            <SelectItem key={idType.code} value={idType.code}>
                              {idType.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="idNumber">ID Number</Label>
                      <Input
                        id="idNumber"
                        value={kycData.idVerification.idNumber}
                        onChange={(e) => updateIdVerification("idNumber", e.target.value)}
                        placeholder="Enter ID number"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="idFront">ID Front Side</Label>
                      <Input
                        id="idFront"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload("idFrontImage", e)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Upload a clear photo of the front side of your ID
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="idBack">ID Back Side (if applicable)</Label>
                      <Input
                        id="idBack"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload("idBackImage", e)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Upload the back side if your ID has information on both sides
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="selfie">Selfie with ID</Label>
                      <Input
                        id="selfie"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload("selfieImage", e)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Take a clear selfie holding your ID next to your face
                      </p>
                    </div>
                  </div>

                  <Alert>
                    <AlertDescription>
                      Ensure all documents are clear, unaltered, and fully visible. Processing may be delayed for poor quality images.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="occupation">Occupation</Label>
                      <Select
                        value={kycData.financialInfo.occupation}
                        onValueChange={(value) => updateFinancialInfo("occupation", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select occupation" />
                        </SelectTrigger>
                        <SelectContent>
                          {OCCUPATIONS.map((occupation) => (
                            <SelectItem key={occupation} value={occupation}>
                              {occupation}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employer">Employer (if applicable)</Label>
                      <Input
                        id="employer"
                        value={kycData.financialInfo.employer}
                        onChange={(e) => updateFinancialInfo("employer", e.target.value)}
                        placeholder="Enter employer name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="income">Monthly Income (USD)</Label>
                      <Select
                        value={kycData.financialInfo.monthlyIncome}
                        onValueChange={(value) => updateFinancialInfo("monthlyIncome", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select income range" />
                        </SelectTrigger>
                        <SelectContent>
                          {INCOME_RANGES.map((range) => (
                            <SelectItem key={range} value={range}>
                              {range}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sourceOfFunds">Source of Funds</Label>
                      <Select
                        value={kycData.financialInfo.sourceOfFunds}
                        onValueChange={(value) => updateFinancialInfo("sourceOfFunds", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          {SOURCE_OF_FUNDS.map((source) => (
                            <SelectItem key={source} value={source}>
                              {source}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transactionVolume">Expected Monthly Transaction Volume (USD)</Label>
                    <Select
                      value={kycData.financialInfo.expectedTransactionVolume}
                      onValueChange={(value) => updateFinancialInfo("expectedTransactionVolume", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select expected volume" />
                      </SelectTrigger>
                      <SelectContent>
                        {INCOME_RANGES.map((range) => (
                          <SelectItem key={range} value={range}>
                            {range}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="pep"
                        checked={kycData.compliance.pepStatus}
                        onCheckedChange={(checked) => updateCompliance("pepStatus", !!checked)}
                      />
                      <div className="space-y-1">
                        <Label htmlFor="pep" className="text-sm font-medium">
                          Politically Exposed Person (PEP) Declaration
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          I confirm that I am not a politically exposed person, nor am I related to or associated with any PEP.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="sanctions"
                        checked={kycData.compliance.sanctionsCheck}
                        onCheckedChange={(checked) => updateCompliance("sanctionsCheck", !!checked)}
                      />
                      <div className="space-y-1">
                        <Label htmlFor="sanctions" className="text-sm font-medium">
                          Sanctions Screening
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          I confirm that I am not subject to any sanctions by any government or regulatory authority.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={kycData.compliance.termsAccepted}
                        onCheckedChange={(checked) => updateCompliance("termsAccepted", !!checked)}
                      />
                      <div className="space-y-1">
                        <Label htmlFor="terms" className="text-sm font-medium">
                          Terms and Conditions
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          I have read and agree to the Terms and Conditions of Service.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="privacy"
                        checked={kycData.compliance.privacyPolicyAccepted}
                        onCheckedChange={(checked) => updateCompliance("privacyPolicyAccepted", !!checked)}
                      />
                      <div className="space-y-1">
                        <Label htmlFor="privacy" className="text-sm font-medium">
                          Privacy Policy
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          I have read and agree to the Privacy Policy and consent to data processing.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <AlertDescription>
                      By submitting this form, you acknowledge that providing false information is a criminal offense and may result in account termination and legal action.
                    </AlertDescription>
                  </Alert>

                  <Button
                    onClick={handleSubmit}
                    disabled={!isStepComplete(3) || isSubmitting}
                    className="w-full"
                    size="lg"
                  >
                    {isSubmitting ? "Submitting..." : "Submit KYC Application"}
                  </Button>
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 3 && (
                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                    disabled={!isStepComplete(currentStep)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}