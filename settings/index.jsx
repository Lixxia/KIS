import {COLORS,FONTS} from "../common/globals.js";

function setDefaults(props) {
  if (!props.settings.color) {
    props.settingsStorage.setItem('color', JSON.stringify(COLORS[0].value)); 
  } else if (!props.settings.color2) {
    props.settingsStorage.setItem('color2', JSON.stringify(COLORS[11].value)); 
  } else if (!props.settings.font) {
    props.settingsStorage.setItem('font', JSON.stringify({"selected":[0],"values":[{"name":FONTS[0].name}]}));
  }
};

function mySettings(props) {
  setDefaults(props);
 
  return (
    <Page>
      
      <Section
        title={<Text bold align="center">Appearance</Text>}
        description={<Text align="center">Adjust color of the clock and stat icons or change clock font.</Text>}>
        <ColorSelect
            title="Primary Color"
            settingsKey="color"
            colors={COLORS}
        />
        <Select
          label="Font Style"
          settingsKey="font"
          options={FONTS}
        />
      </Section>
      <Section title={<Text bold align="center">Support</Text>}>   
      </Section>
    </Page>

  );
}

registerSettingsPage(mySettings);