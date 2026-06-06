
import { connect } from "node:http2";
import { Modality, Role } from "../generated/prisma/enums";
import { prisma } from "../src/config/prisma";
async function main() {
    console.log("Iniciando seed...");
    // 1. Limpieza de datos
    const models = [
        prisma.appointment,
        prisma.category,
        prisma.professional,
        prisma.service,
        prisma.specialty,
        prisma.user,
    ];
    for (const model of models) {
        await (model as any).deleteMany()
    }
    await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 0;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE \`Appointment\` AUTO_INCREMENT = 1;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE \`Service\` AUTO_INCREMENT = 1;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE \`Professional\` AUTO_INCREMENT = 1;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE \`Category\` AUTO_INCREMENT = 1;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE \`Specialty\` AUTO_INCREMENT = 1;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE \`usuario\` AUTO_INCREMENT = 1;`);
    await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 1;`);
    // 2. Creación de datos maestros (Independientes)
    //Categorias
    await prisma.user.createMany({
        data: [
            { email: "admin@habitatt.com", nombre: "Admin", apellido: "Admin", password: "123456", role: Role.ADMIN },
            { email: "loona@gmail.com", nombre: "Loona", apellido: "Wolf", password: "123456", role: Role.USER },
            { email: "balto@gmail.com", nombre: "Balto", apellido: "Kaltag", password: "123456", role: Role.USER },
            { email: "dominic@gmail.com", nombre: "Dominc", apellido: "Toretto", password: "123456", role: Role.USER },
            { email: "james@gmail.com", nombre: "James", apellido: "Bond", password: "123456", role: Role.USER },
            { email: "jonh@gmail.com", nombre: "Jonh", apellido: "McClane", password: "123456", role: Role.USER },
            { email: "indi@gmail.com", nombre: "Indiana", apellido: "Jones", password: "123456", role: Role.USER },
            { email: "albertw@gmail.com", nombre: "Albert", apellido: "Wesker", password: "123456", role: Role.USER },
        ],
    })
    await prisma.category.createMany({
        data: [
            { nombre: "Diseño", descripcion: "Transformación de ideas en propuestas profesionales." },
            { nombre: "Tramitología", descripcion: "Asesoría y acompañamiento para los diversos requisitos gubernamentales." },
            { nombre: "Planificación", descripcion: "Desarrollo de soluciones arquitectónicas y tecnicas de su proyecto." },
            { nombre: "Ejecución", descripcion: "Implementación de proyectos en físico." },
            { nombre: "Contable", descripcion: "Presupuestos y cotizaciones.", isActive: false },
        ],
    })
    await prisma.specialty.createMany({
        data: [
            { nombre: "Remodelación y Optimización de Espacios", descripcion: "Propuestas de redistribución y mejora de espacios existentes para aumentar su funcionalidad." },
            { nombre: "Selección de Materiales y Acabados", descripcion: "Asesoría especializada en la elección de revestimientos, colores, mobiliario, iluminación, etc." },
            { nombre: "Modelado y Visualización 3D", descripcion: "Elaboración de representaciones tridimensionales que permiten visualizar el resultado final." },
            { nombre: "Diseño de Vivienda Unifamiliar", descripcion: "soluciones habitacionales personalizadas." },
            { nombre: "Coordinación de Trámites Institucionales", descripcion: "Gestión y seguimiento de procesos administrativos ante entidades públicas y privadas." },
            { nombre: "Gestión Documental", descripcion: "Organización, control y administración de documentos físicos y digitales." },
            { nombre: "Diseño Estructural", descripcion: "Cálculo y diseño de estructuras de concreto, acero y otros materiales." },
            { nombre: "Evaluación y Diagnóstico de Estructuras", descripcion: "Inspección técnica de edificaciones existentes para identificar patologías." },
            { nombre: "Análisis Sísmico", descripcion: "Evaluación del comportamiento estructural ante eventos sísmicos." },
            { nombre: "Supervisión Técnica de Obras", descripcion: "Verificación en campo de la correcta ejecución de los elementos estructurales.", isActive: false },
        ]
    })
    
    // 3. Recuperar datos para mapeo (Uso de Maps para optimizar)
    const [cats, profs, servs, spcs, users] = await Promise.all([
        prisma.category.findMany(),
        prisma.professional.findMany(),
        prisma.service.findMany(),
        prisma.specialty.findMany(),
        prisma.user.findMany()
    ])
    const catMap = Object.fromEntries(cats.map((c) => [c.nombre, c.id]));
    const profMap = Object.fromEntries(profs.map((e) => [e.nombre, e.id]));
    const servMap = Object.fromEntries(servs.map((p) => [p.nombre, p.id]));
    const spcMap = Object.fromEntries(spcs.map((s) => [s.nombre, s.id]));
    const userMap = Object.fromEntries(users.map((u) => [u.email, u.id]));
    

    await prisma.professional.create({
        data:{
            nombre: "Lyra",
            apellido: "Heartstring", 
            email: "lyraHS@construred.com", 
            titulo: "Diseñadora de interiores", 
            expAnnos: 5, 
            ubicacion: "Central",
        //Relaciones
        especialidades: {
            connect:[{id: spcMap["Remodelación y Optimización de Espacios"]},{id: spcMap["Selección de Materiales y Acabados"]}]
        },
    }
    })
    await prisma.professional.create({
        data:{
            nombre: "Anakyn", apellido: "Skywalker", email: "anakyn1@vanguardia.com", titulo: "Arquitecto", expAnnos: 8, ubicacion: "Central",
        //Relaciones
        especialidades: {
            connect:[{id: spcMap["Modelado y Visualización 3D"]},{id: spcMap["Diseño de Vivienda Unifamiliar"]}]
        },
    }
    })
    await prisma.professional.create({
        data:{
            nombre: "Dulcinea", apellido: "Spots", email: "tramites@expedia.com", titulo: "Ejecutiva en Gestión Administrativa", expAnnos: 5, ubicacion: "Central",
        //Relaciones
        especialidades: {
            connect:[{id: spcMap["Coordinación de Trámites Institucionales"]},{id: spcMap["Gestión Documental"]}]
        },
    }
    })
    await prisma.professional.create({
        data:{
            nombre: "Jill", apellido: "Valentine", email: "jvrcing@ingenieriaespecial.com", titulo: "Ingeniera Estructural", expAnnos: 2, ubicacion: "Central",
        //Relaciones
        especialidades: {
            connect:[{id: spcMap["Diseño Estructural"]},{id: spcMap["Evaluación y Diagnóstico de Estructuras"]}]
        },
    }
    })
    await prisma.professional.create({
        data:{
            nombre: "Allan", apellido: "Grant", email: "allangjp@ingenieriaespecial.com", titulo: "Ingeniero Civil", expAnnos: 2, ubicacion: "Central",
            isAvailable: false,
        //Relaciones
        especialidades: {
            connect:[{id: spcMap["Análisis Sísmico"]},{id: spcMap["Supervisión Técnica de Obras"]}]
        },
    }
    }) 
    
    await prisma.service.createMany({
        data: [
            { nombre: "Diseño Arquitectónico", descripcion: "Desarrollo de planos arquitectónicos personalizados cumpliendo con las normativas aplicables.", modality: Modality.MIXTA, profesionalId: 1, categoriaId: 1 },
            { nombre: "Gestión de Permisos de Construcción", descripcion: "Solicitud y seguimiento de permisos ante entidades reguladoras, agilizando los procesos necesarios.", modality: Modality.MIXTA, profesionalId: 3, categoriaId: 2 },
            { nombre: "Elaboración de Cronogramas de Obra", descripcion: "Creación de planes de trabajo detallados que definen actividades, recursos, tiempos de ejecución.", modality: Modality.MIXTA, profesionalId: 4, categoriaId: 3 },
            { nombre: "Construcción Llave en Mano", descripcion: "Ejecución integral de proyectos de construcción con entregar obras terminadas listas para su uso.", modality: Modality.MIXTA, profesionalId: 4, categoriaId: 4 },
            { nombre: "Control Presupuestario y Costos", descripcion: "Administración y seguimiento de presupuestos de obra, control de gastos, análisis de costos y elaboración de reportes financieros.", modality: Modality.MIXTA, profesionalId: 2, categoriaId: 4 },
            { nombre: "Diseño de Interiores", descripcion: "Planificación y diseño de espacios interiores funcionales y estéticamente atractivos, adaptados a las necesidades del cliente.", modality: Modality.MIXTA, profesionalId: 1, categoriaId: 1 },
            { nombre: "Regularización de Propiedades", descripcion: "Gestión de documentación y trámites necesarios para la legalización, inscripción y actualización de propiedades.", modality: Modality.MIXTA, profesionalId: 3, categoriaId: 2 },
            { nombre: "Planificación de Recursos de Obra", descripcion: "Definición y coordinación de materiales, personal y equipos necesarios para la ejecución eficiente del proyecto.", modality: Modality.MIXTA, profesionalId: 4, categoriaId: 3 },
            { nombre: "Supervisión Técnica de Construcción", descripcion: "Monitoreo y control de los procesos constructivos para garantizar el cumplimiento de planos, especificaciones y estándares de calidad.", modality: Modality.MIXTA,  profesionalId: 4, categoriaId: 4 },
            { nombre: "Análisis de Viabilidad Financiera", descripcion: "Evaluación de costos, inversiones y proyecciones económicas para determinar la factibilidad financiera de proyectos constructivos.", modality: Modality.MIXTA, profesionalId: 2, categoriaId: 4 },
        ],
    })
    
    // 6. Creación de Citas
    await prisma.appointment.create({
        data:{
            fecha: new Date(Date.UTC(2026, 5, 6)), //5 de junio
            hora: "10:00am",
            modalidad: Modality.PRESENCIAL,

            //Relaciones
            clienteId: 1,
            profesionalId: 1,
        }
    })
    await prisma.appointment.create({
        data:{
            fecha: new Date(Date.UTC(2026, 13, 6)),
            hora: "7:00am",
            modalidad: Modality.VIRTUAL,

            //Relaciones
            clienteId: 1,
            profesionalId: 2,
        }
    })
    await prisma.appointment.create({
        data:{
            fecha: new Date(Date.UTC(2026, 5, 8)),
            hora: "10:00am",
            modalidad: Modality.PRESENCIAL,

            //Relaciones
            clienteId: 2,
            profesionalId: 1,
        }
    })
    await prisma.appointment.create({
        data:{
            fecha: new Date(Date.UTC(2026, 10, 8)),
            hora: "11:00am",
            modalidad: Modality.PRESENCIAL,

            //Relaciones
            clienteId: 2,
            profesionalId: 1,
        }
    })
    await prisma.appointment.create({
        data:{
            fecha: new Date(Date.UTC(2026, 5, 10)),
            hora: "1:00pm",
            modalidad: Modality.VIRTUAL,

            //Relaciones
            clienteId: 3,
            profesionalId: 2,
        }
    })
    await prisma.appointment.create({
        data:{
            fecha: new Date(Date.UTC(2026, 12, 7)), 
            hora: "3:00pm",
            modalidad: Modality.VIRTUAL,

            //Relaciones
            clienteId: 3,
            profesionalId: 3,
        }
    })
    await prisma.appointment.create({
        data:{
            fecha: new Date(Date.UTC(2026, 5, 10)),
            hora: "4:00pm",
            modalidad: Modality.PRESENCIAL,

            //Relaciones
            clienteId: 4,
            profesionalId: 4,
        }
    })
    await prisma.appointment.create({
        data:{
            fecha: new Date(Date.UTC(2026, 12, 7)),
            hora: "2:00pm",
            modalidad: Modality.VIRTUAL,

            //Relaciones
            clienteId: 4,
            profesionalId: 3,
        }
    })
    await prisma.appointment.create({
        data:{
            fecha: new Date(Date.UTC(2026, 14, 6)),
            hora: "7:00am",
            modalidad: Modality.PRESENCIAL,

            //Relaciones
            clienteId: 5,
            profesionalId: 2,
        }
    })
    await prisma.appointment.create({
        data:{
            fecha: new Date(Date.UTC(2026, 5, 8)),
            hora: "9:00am",
            modalidad: Modality.PRESENCIAL,

            //Relaciones
            clienteId: 6,
            profesionalId: 5,
        }
    })
    await prisma.appointment.create({
        data:{
            fecha: new Date(Date.UTC(2026, 19, 8)), 
            hora: "11:00am",
            modalidad: Modality.PRESENCIAL,

            //Relaciones
            clienteId: 6,
            profesionalId: 4,
        }
    })
    await prisma.appointment.create({
        data:{
            fecha: new Date(Date.UTC(2026, 7, 6)), 
            hora: "8:00am",
            modalidad: Modality.PRESENCIAL,

            //Relaciones
            clienteId: 7,
            profesionalId: 3,
        }
    })
    await prisma.appointment.create({
        data:{
            fecha: new Date(Date.UTC(2026, 24, 8)), 
            hora: "2:00pm",
            modalidad: Modality.PRESENCIAL,

            //Relaciones
            clienteId: 8,
            profesionalId: 2,
        }
    })
    console.log("Seed completado con éxito.");
}
main()
    .catch((e) => {
        console.error("Error en seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
