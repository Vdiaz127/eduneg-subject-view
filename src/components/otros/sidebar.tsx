'use client';

import { useState } from 'react';
import { Box, Button, VStack, HStack, Text } from '@chakra-ui/react';
import { FiHome, FiSettings, FiUsers, FiMenu, FiX } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const Sidebar = ({ userRole }: { userRole: string }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems: Record<string, { name: string; icon: any; path: string }[]> = {
    admin: [
      { name: 'Home', icon: FiHome, path: '/' },
      { name: 'Admin', icon: FiUsers, path: '/Administrador' }, 
      { name: 'Settings', icon: FiSettings, path: '/settings' },
    ],
    user: [
      { name: 'Home', icon: FiHome, path: '/' },
      { name: 'Settings', icon: FiSettings, path: '/settings' },
    ],
    guest: [{ name: 'Home', icon: FiHome, path: '/' }],
  };

  const items = menuItems[userRole] || menuItems['guest'];

  return (
    <>
      {/* Botón de menú en móviles */}
      <Button
        onClick={toggleMenu}
        display={{ base: 'block', md: 'none' }}
        position="fixed"
        top={4}
        left={4}
        zIndex={100}
        bg="gray.800"
        color="white"
        p={2}
        borderRadius="md"
        opacity={0.7}
        _hover={{ opacity: 1 }}
      >
        {isOpen ? <FiX /> : <FiMenu />}
      </Button>

      {/* Sidebar adaptable (único elemento para móvil y escritorio) */}
      <Box
        as="nav"
        position="fixed"
        top={0}
        left={{ base: isOpen ? 0 : '-250px', md: 0 }} 
        w="250px"
        h="100vh"
        bg="gray.800"
        color="white"
        transition="left 0.3s ease-in-out"
        zIndex={90}
        overflowY="auto"
      >
        <VStack align="start" m={4} gap={4}>
          {items.map((item) => (
            <HStack
              key={item.name}
              w="full"
              as="button"
              onClick={() => {
                router.push(item.path);
                setIsOpen(false); 
              }}
              _hover={{ bg: 'gray.700' }}
              p={2}
              borderRadius="md"
            >
              <item.icon />
              <Text ml={2}>{item.name}</Text>
            </HStack>
          ))}
        </VStack>
      </Box>
    </>
  );
};

export default Sidebar;
