import MainPage from "./components/MainPage.tsx";
import {MantineProvider} from "@mantine/core";
import '@mantine/core/styles.css';

export default function Page () {
  return (
      <MantineProvider>
        <MainPage />
      </MantineProvider>

  );
}