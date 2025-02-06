import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Materia from "@/models/materia";

export async function GET() {
  await connectDB();

  try {
    const materias = await Materia.find();
    return NextResponse.json(materias);
  } catch (error) {
    console.error("Error al obtener materias:", error);
    return NextResponse.json(
      { message: "Error al obtener materias", error },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await connectDB();

  try {
    const { codigo, nombre, descripcion, creditos } = await request.json();

    if (!codigo || !nombre || !descripcion || creditos === undefined) {
      return NextResponse.json(
        { message: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    const nuevaMateria = new Materia({ codigo, nombre, descripcion, creditos });
    await nuevaMateria.save();

    return NextResponse.json(nuevaMateria, { status: 201 });
  } catch (error) {
    console.error("Error al registrar la materia:", error);
    return NextResponse.json(
      { message: "Error al registrar la materia", error },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  await connectDB();

  try {
    const { id } = await request.json();

    const materia = await Materia.findById(id);
    if (!materia) {
      return NextResponse.json(
        { message: "Materia no encontrada" },
        { status: 404 }
      );
    }

    materia.activo = !materia.activo; // Alterna el estado activo/inactivo
    await materia.save();

    return NextResponse.json({ message: "Estado de la materia actualizado", materia });
  } catch (error) {
    console.error("Error al actualizar la materia:", error);
    return NextResponse.json(
      { message: "Error al actualizar la materia", error },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  await connectDB();

  try {
    const { id, codigo, nombre, descripcion, creditos } = await request.json();

    const materia = await Materia.findById(id);
    if (!materia) {
      return NextResponse.json(
        { message: "Materia no encontrada" },
        { status: 404 }
      );
    }

    materia.codigo = codigo;
    materia.nombre = nombre;
    materia.descripcion = descripcion;
    materia.creditos = creditos;

    await materia.save();

    return NextResponse.json({ message: "Materia actualizada correctamente", materia });
  } catch (error) {
    console.error("Error al actualizar la materia:", error);
    return NextResponse.json(
      { message: "Error al actualizar la materia", error },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  await connectDB();

  try {
    const { id } = await request.json();

    const materia = await Materia.findByIdAndDelete(id);
    if (!materia) {
      return NextResponse.json(
        { message: "Materia no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Materia eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la materia:", error);
    return NextResponse.json(
      { message: "Error al eliminar la materia", error },
      { status: 500 }
    );
  }
}

