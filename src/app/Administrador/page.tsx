"use client";
import Link from "next/link";
import {
  Box,
  Button,
  Fieldset,
  IconButton,
  Input,
  Table,
  Text,
  Textarea,
  Spinner
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { useRouter } from "next/navigation";
import { LuEye, LuEyeOff, LuSettings, LuTrash } from 'react-icons/lu';

interface Materia {
  _id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  creditos: number;
  activo: boolean;
}


export default function MateriasPage() {

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSelectedMateria({
      ...selectedMateria!,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMateria) return;
  
    setLoading(true);
    try {
      const response = await fetch(`/api/materias`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedMateria._id,
          codigo: selectedMateria.codigo,
          nombre: selectedMateria.nombre,
          descripcion: selectedMateria.descripcion,
          creditos: Number(selectedMateria.creditos),
        }),
      });
  
      if (response.ok) {
        await fetchMaterias(); // Espera que se actualicen los datos antes de cerrar
        setSelectedMateria(null); // Limpia el estado de la materia seleccionada
        setEditModalOpen(false); // Cierra el modal
      } else {
        const result = await response.json();
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Error al actualizar materia:", error);
    } finally {
      setLoading(false);
    }
  };
  
  

  const [materias, setMaterias] = useState<Materia[]>([]);
  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    creditos: "",
  });

  const [loading, setLoading] = useState(true);
  
  const router = useRouter();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMateria, setSelectedMateria] = useState<Materia | null>(null);

  


  useEffect(() => {
    fetchMaterias();
  }, []);

  const fetchMaterias = async () => {
    try {
      const response = await fetch("/api/materias");
      const data = await response.json();
      setMaterias(data);
      setLoading(false); 
    } catch (error) {
      console.error("Error al obtener materias:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/materias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, creditos: Number(form.creditos) }),
      });

      if (response.ok) {
        fetchMaterias();
        setForm({ codigo: "", nombre: "", descripcion: "", creditos: "" });
      }
    } catch (error) {
      console.error("Error al registrar materia:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/materias`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
  
      if (response.ok) {
        await fetchMaterias(); // Recarga la lista
        setDeleteModalOpen(false); // Cierra el modal
        setSelectedMateria(null); // Limpia el estado de la materia seleccionada
      }
    } catch (error) {
      console.error("Error al eliminar materia:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const toggleMateria = async (id: string) => {
    try {
      await fetch("/api/materias", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchMaterias();
    } catch (error) {
      console.error("Error al cambiar estado de materia:", error);
    }
  };

  return (
    <Box as="section" p={4} w="full" minH="100vh" display="flex" flexDirection="column" alignItems="center">
      <Text fontSize="2xl" fontWeight="bold" mb={4} alignContent="center">
        Registro de Materias
      </Text>

      <Box
        as="form"
        onSubmit={handleSubmit}
        p={4}
        shadow="md"
        borderRadius="lg"
        w="full"
        maxW={{ base: "100%", md: "80%" }} // Ajuste para pantallas grandes
      >
        

        <Fieldset.Root>
          <Fieldset.Legend>Datos de la Materia</Fieldset.Legend>

          <Field label="Código">
            <Input name="codigo" value={form.codigo} onChange={handleChange} />
          </Field>

          <Field label="Nombre">
            <Input name="nombre" value={form.nombre} onChange={handleChange} />
          </Field>

          <Field label="Descripción">
            <Textarea name="descripcion" value={form.descripcion} onChange={handleChange} />
          </Field>

          <Field label="Créditos">
            <Input name="creditos" type="number" value={form.creditos} onChange={handleChange} />
          </Field>

          <Button type="submit" colorScheme="blue" loading={loading}>
            Registrar Materia
          </Button>
        </Fieldset.Root>
      </Box>

      <Text fontSize="2xl" fontWeight="bold" mt={6} mb={4}>
        Listado de Materias
      </Text>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <Spinner size="xl" />
      </Box>
      ) : (
      <Box flex="1" overflowX="auto" w="full" maxW={{ base: "100%", md: "80%" }}>
        <Table.Root variant="outline" minW="600px">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader display={{ base: "none", md: "table-cell" }}>Código</Table.ColumnHeader>
              <Table.ColumnHeader>Nombre</Table.ColumnHeader>
              <Table.ColumnHeader display={{ base: "none", md: "table-cell" }}>Descripción</Table.ColumnHeader>
              <Table.ColumnHeader>Créditos</Table.ColumnHeader>
              <Table.ColumnHeader>Estado</Table.ColumnHeader>
              <Table.ColumnHeader>Acciones</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
          {materias.length > 0 ? (
            materias.map((materia) => (
              <Table.Row key={materia._id}>
                <Table.Cell display={{ base: "none", md: "table-cell" }} whiteSpace="nowrap">
                  {materia.codigo}
                </Table.Cell>
                <Table.Cell whiteSpace="nowrap">
                  <Link href={`/Materia/${materia._id}/view`} passHref>
                    <Text as="span" color="blue.500" _hover={{ textDecoration: "underline", cursor: "pointer" }}>
                      {materia.nombre}
                    </Text>
                  </Link>
                </Table.Cell>
                <Table.Cell display={{ base: "none", md: "table-cell" }} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                  {materia.descripcion}
                </Table.Cell>
                <Table.Cell whiteSpace="nowrap">{materia.creditos}</Table.Cell>
                <Table.Cell whiteSpace="nowrap">
                  <IconButton
                    aria-label="Toggle estado"
                    variant="ghost"
                    onClick={() => toggleMateria(materia._id)}
                  >
                    {materia.activo ? <LuEye /> : <LuEyeOff />}
                  </IconButton>
                </Table.Cell>
                <Table.Cell>
                
                <DialogRoot 
                  open={editModalOpen} 
                  onOpenChange={(openDetails) => {
                    if (!openDetails.open) {
                      setSelectedMateria(null); // Limpia el estado si se cierra el modal
                    }
                    setEditModalOpen(openDetails.open);
                  }}
                >

                  <DialogTrigger asChild>
                    <IconButton
                      aria-label="Editar"
                      variant="ghost"
                      onClick={() => {
                        setSelectedMateria(materia);
                        setEditModalOpen(true);
                      }}
                    >
                      <LuSettings />
                    </IconButton>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Materia</DialogTitle>
                      <DialogCloseTrigger />
                    </DialogHeader>
                    <DialogBody>
                      <Text>Editar datos de la materia {selectedMateria?.nombre}.</Text>

                      <Box as="form" onSubmit={handleEditSubmit}>
                        <Fieldset.Root>
                          <Fieldset.Legend>Datos de la Materia</Fieldset.Legend>

                          <Field label="Código">
                            <Input
                              name="codigo"
                              value={selectedMateria?.codigo || ""}
                              onChange={handleEditChange}
                            />
                          </Field>

                          <Field label="Nombre">
                            <Input
                              name="nombre"
                              value={selectedMateria?.nombre || ""}
                              onChange={handleEditChange}
                            />
                          </Field>

                          <Field label="Descripción">
                            <Textarea
                              name="descripcion"
                              value={selectedMateria?.descripcion || ""}
                              onChange={handleEditChange}
                            />
                          </Field>

                          <Field label="Créditos">
                            <Input
                              name="creditos"
                              type="number"
                              value={selectedMateria?.creditos || ""}
                              onChange={handleEditChange}
                            />
                          </Field>
                        </Fieldset.Root>
                      </Box>
                    </DialogBody>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancelar</Button>
                      <Button onClick={handleEditSubmit}>Guardar</Button>
                    </DialogFooter>
                  </DialogContent>
                </DialogRoot>

                <DialogRoot open={deleteModalOpen} onOpenChange={(openDetails) => setDeleteModalOpen(openDetails.open)}>

                  <DialogTrigger asChild>
                    <IconButton
                      aria-label="Eliminar"
                      variant="ghost"
                      onClick={() => {
                        setSelectedMateria(materia);
                        setDeleteModalOpen(true);
                      }}
                    >
                      <LuTrash />
                    </IconButton>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Eliminar Materia</DialogTitle>
                      <DialogCloseTrigger />
                    </DialogHeader>
                    <DialogBody>
                      <Text>¿Estás seguro de que deseas eliminar la materia {selectedMateria?.nombre}?</Text>
                    </DialogBody>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Cancelar</Button>
                      <Button
                        colorScheme="red"
                        onClick={() => {
                          if (selectedMateria) {
                            handleDelete(selectedMateria._id);
                          }
                        }}
                      >
                        Eliminar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </DialogRoot>

                </Table.Cell>

              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={6} textAlign="center" py={4}>
                No hay materias registradas.
              </Table.Cell>
            </Table.Row>
          )}
          </Table.Body>
        </Table.Root>
      </Box>
      )}
    </Box>
    
  );
}
