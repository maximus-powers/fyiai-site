import { useEffect, useState } from 'react';
import { Switch, Flex, FormLabel, Box, useColorMode } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

const DarkModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Check if the user has a preferred theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
      }
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    toggleColorMode();
  };

  return (
    <Flex align="center">
      <Box position="relative">
        <Switch
          id="dark-mode-toggle"
          isChecked={theme === 'dark'}
          onChange={toggleTheme}
          colorScheme="green"
          size="lg"
        />
        <Box
          position="absolute"
          top="50%"
          left={theme === 'dark' ? '5px' : '5px'}
          transform="translateY(-58%)"
          transition="left 0.2s"
          onClick={toggleTheme}
          cursor="pointer"
        >
          {theme === 'dark' ? (
            <MoonIcon color="black" />
          ) : (
            <SunIcon color="yellow.400" />
          )}
        </Box>
      </Box>
    </Flex>
  );
};

export default DarkModeToggle;
