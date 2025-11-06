export type ProviderMetaDataProps = Readonly<{
  providerName: string;
  providerLicensingId: string;
  postalAddress: string;
  city: string;
  zip: string

  providerPhone: string;
  providerEmail: string;
  providerType: string; // define types
  providerStatus: string; //define statuses
}>;

export const ProviderMetaDataSection = ({

}: ProviderMetaDataProps) => {
  return <div>ProviderMetaDataSection</div>;
};
