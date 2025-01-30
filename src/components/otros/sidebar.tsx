'use client';

import { Box, VStack, HStack, IconButton, Text, Button } from '@chakra-ui/react';
import { FiHome, FiSettings, FiUsers, FiMenu } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from '@/components/ui/drawer';
import { useState } from 'react';

const Sidebar = ({ userRole }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Define menu items based on user roles
  const menuItems = {
    admin: [
      { name: 'Home', icon: FiHome, path: '/' },
      { name: 'Users', icon: FiUsers, path: '/users' },
      { name: 'Settings', icon: FiSettings, path: '/settings' },
    ],
    user: [
      { name: 'Home', icon: FiHome, path: '/' },
      { name: 'Settings', icon: FiSettings, path: '/settings' },
    ],
    guest: [
      { name: 'Home', icon: FiHome, path: '/' },
    ],
  };

  const items = menuItems[userRole] || menuItems['guest'];

  return (
    <>
      <DrawerRoot open={open} onOpenChange={(e) => setOpen(e.open)} placement="start" size="xs">
        {/* Mobile Menu Trigger */}
        <DrawerTrigger asChild>
          <Button display={{ base: 'block', md: 'none' }} onClick={() => setOpen(true)} bg="gray.800" color="white">
            <FiMenu />
          </Button>
        </DrawerTrigger>

        {/* Sidebar for Mobile */}
        <DrawerBackdrop />
        <DrawerContent bg="gray.800" color="white">
          <DrawerHeader>
            <DrawerTitle>Menu</DrawerTitle>
          </DrawerHeader>
          <DrawerBody >
            <VStack align="start" m={4}>
              {items.map((item) => (
                <HStack
                  key={item.name}
                  w="full"
                  as="button"
                  onClick={() => {
                    router.push(item.path);
                    setOpen(false);
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
          </DrawerBody>
          <DrawerFooter>
            <DrawerActionTrigger asChild>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            </DrawerActionTrigger>
          </DrawerFooter>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>

      {/* Sidebar for Desktop */}
      <Box
        as="nav"
        bg="gray.800"
        color="white"
        w={{ base: 'full', md: '250px' }}
        h="100vh"
        p={4}
        display={{ base: 'none', md: 'block' }}
      >
        <VStack align="start" m={4}>
          {items.map((item) => (
            <HStack
              key={item.name}
              w="full"
              as="button"
              onClick={() => router.push(item.path)}
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
