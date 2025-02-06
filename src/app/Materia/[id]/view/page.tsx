import { connectDB } from "@/lib/mongodb";
import { For, Stack, createListCollection } from "@chakra-ui/react";
import Materia from "@/models/materia";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { Box, Text, VStack, Button, HStack } from "@chakra-ui/react";

async function getMateria(id: string) {
  if (!id) return null;
  await connectDB();
  try {
    const materia = await Materia.findById(id);
    return materia ? JSON.parse(JSON.stringify(materia)) : null;
  } catch (error) {
    console.error("Error al obtener la materia:", error);
    return null;
  }
}

// Datos estáticos simulados con "label" y "value" como en el ejemplo > https://www.chakra-ui.com/docs/components/select

const profesoresData = [
  { label: "Profesor Juan Pérez", value: "1" },
  { label: "Profesora Ana Gómez", value: "2" },
  { label: "Profesor Carlos Rodríguez", value: "3" },
];

const estudiantesData = [
  { label: "Estudiante Luis García", value: "1" },
  { label: "Estudiante María López", value: "2" },
  { label: "Estudiante Jorge Martínez", value: "3" },
];

const profesoresCollection = createListCollection({
  items: profesoresData,
});

const estudiantesCollection = createListCollection({
  items: estudiantesData,
});

export default async function MateriaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const materia = await getMateria(id);

  if (!materia) {
    return <Text color="red.500" fontSize="lg" textAlign="center">No se encontró la materia</Text>;
  }

  return (
    <Box
      mx="auto"
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
      bg="black"
      w="full"
      maxW={{ base: "100%", md: "80%" }}
    >
      <Text fontSize="3xl" fontWeight="bold" textAlign="center" mb={4}>
        {materia.nombre}
      </Text>

      <VStack align="start" w="100%">
        <Box w="100%" pb={2} borderBottom="1px solid #E2E8F0">
          <Text fontSize="lg"><strong>Código:</strong> {materia.codigo}</Text>
        </Box>
        <Box w="100%" pb={2} borderBottom="1px solid #E2E8F0">
          <Text fontSize="lg"><strong>Descripción:</strong> {materia.descripcion}</Text>
        </Box>
        <Box w="100%" pb={2}>
          <Text fontSize="lg"><strong>Créditos:</strong> {materia.creditos}</Text>
        </Box>
      </VStack>

      <HStack mt={6} justify="center" gap={4} flexWrap="wrap">
        {/* Asignar Profesor */}
        <Box>
          <Button colorScheme="blue" w={{ base: "full", sm: "auto" }}>
            Asignar Profesor
          </Button>
          <SelectRoot size="sm" width="100%" mt={2} collection={profesoresCollection}>
            <SelectLabel>Seleccionar profesor</SelectLabel>
            <SelectTrigger>
              <SelectValueText placeholder="Selecciona un profesor" />
            </SelectTrigger>
            <SelectContent>
              {profesoresData.map((profesor) => (
                <SelectItem key={profesor.value} item={profesor}>
                  {profesor.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        </Box>

        {/* Asignar Estudiantes */}
        <Box>
          <Button colorScheme="green" w={{ base: "full", sm: "auto" }}>
            Asignar Estudiantes
          </Button>
          <SelectRoot size="sm" width="100%" mt={2} collection={estudiantesCollection} multiple>
            <SelectLabel>Seleccionar estudiantes</SelectLabel>
            <SelectTrigger>
              <SelectValueText placeholder="Selecciona estudiantes" />
            </SelectTrigger>
            <SelectContent>
              {estudiantesData.map((estudiante) => (
                <SelectItem key={estudiante.value} item={estudiante}>
                  {estudiante.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        </Box>
      </HStack>
    </Box>
  );
}
