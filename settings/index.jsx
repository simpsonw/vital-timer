registerSettingsPage(({ settings }) => (
  <Page>
    <Section
      title={
        <Text bold align="center">
         Vital Timer Settings 
        </Text>
      }
    >
    <Select 
      label={`Timer Duration`}
      settingsKey="duration" 
      options={[
          {name: "15 seconds", value: "150"},
          {name: "30 seconds", value: "300"},
          {name: "60 seconds", value: "600"},
      ]}
    />
    </Section>
  </Page>
));
