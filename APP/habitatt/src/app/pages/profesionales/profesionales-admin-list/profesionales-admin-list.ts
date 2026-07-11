import { Component, computed, inject, signal, effect } from '@angular/core';
import { ProfesionalService } from '../../../../core/services/profesional.service';
import {profesional, ProfesionalUpdateDto} from '../../../../core/models/profesional.model'
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { isActive, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { especialidad } from '../../../../core/models/especialidad.model';
import { EspecialidadService } from '../../../../core/services/especialidad.service';
import { MatTableModule } from '@angular/material/table';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-profesionales-list',
  imports: [FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSelectModule,
    CommonModule, 
  MatCheckbox],
  templateUrl: './profesionales-admin-list.html',
  styleUrl: './profesionales-admin-list.css',
})
export class ProfesionalesAdminList {
private readonly profesionalService = inject(ProfesionalService);
private readonly spcService = inject(EspecialidadService);
  //Listar:
  profs = signal<profesional[]>([]);
  //Filtro de busqueda
  search = signal('');
  //Indicador de carga
  loading = signal(false);
  //Error
  error = signal<string | null>(null);
  //Para filtro por especialidad
  especialidadId = signal<number | null>(null);
  epc = signal <especialidad[] | null>(null);
  disponible = signal<boolean>(false);

  displayedColumns = [
    'image',
    'nombre',
    'titulo',
    'modalidad',
    'tarifa',
    'disponibilidad',
    'acciones',
  ];
  ngOnInit(): void {
    this.listarEspecialidades();
    this.loadDataProfesionales();
  }

  listarEspecialidades(): void {
    this.spcService.listar().subscribe({
      next: (response) => {
        this.epc.set(response.data);
      }
    })
  }

  loadDataProfesionales(): void {
    this.loading.set(true);
    this.error.set(null);

    this.profesionalService.listar().subscribe({
      next: (response) => {
        this.profs.set(response.data);
        this.loading.set(false);
        console.log('Profesionales cargados:', response.data);
      },
      error: () => {
        this.error.set('No se pudieron cargar los profesionales.');
        this.loading.set(false);
      },
    });
  }
  profesionalesFiltrados = computed(()=>{
    const text = this.search().trim().toLowerCase();
    const selectedSpcId = this.especialidadId();
    return this.profs().filter((profesional) => {
      const nombre = profesional.nombre?.toLocaleLowerCase() ?? '';
      const apellido = profesional.apellido?.toLowerCase() ?? '';
      const coincidencia = text.length === 0 || nombre.includes(text) || apellido.includes(text);
      let coincideEspecialidad = true;
      if(selectedSpcId !== null){
        console.log("Especialidad seleccionada: " + selectedSpcId);
        const listaEspecialidades = profesional.especialidades ?? [];
        coincideEspecialidad = listaEspecialidades.some((esp: any) => esp.id == selectedSpcId);
        console.log("Especialidad prof: " + JSON.stringify(profesional.especialidades, null, 2));
      }
      const coincideDisponibilidad = !this.disponible() || profesional.isAvailable;
      return coincidencia && coincideEspecialidad && coincideDisponibilidad;
    });
  })
  
  total = computed(() => this.profesionalesFiltrados().length);

  getImageUrl(imageName: string): string {
    return this.profesionalService.getImageUrl(imageName);
  }

  cambiarEstado(profesional: profesional): void {
  const nuevoEstado = !profesional.isActive;
  const datosActualizados: Partial<ProfesionalUpdateDto> = {
    isActive: nuevoEstado
  };
  this.profesionalService.actualizar(profesional.id, datosActualizados)
    .subscribe({
      next: () => {profesional.isActive = nuevoEstado;
        this.profs.update(lista => lista.map(p => p.id === profesional.id ? {...p, isActive: nuevoEstado}: p));
      },
      error: () => {console.error('No se pudo cambiar el estado del profesional');}
    });
  }
}
