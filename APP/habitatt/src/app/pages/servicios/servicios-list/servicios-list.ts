import { Component, computed, inject, input, signal } from '@angular/core';
import { ServicioService } from '../../../../core/services/servicio.service';
import { Servicio } from '../../../../core/models/servicio.model'
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ProfesionalService } from '../../../../core/services/profesional.service';
import { categoria } from '../../../../core/models/categoria.model';
import { CategoriaService } from '../../../../core/services/categoria.service';
import { Modality } from '../../../../core/models/modality.model';
import { ModalityService } from '../../../../core/services/modality.service';

@Component({
  selector: 'app-servicios-list',
  imports: [FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    CommonModule],
  templateUrl: './servicios-list.html',
  styleUrl: './servicios-list.css',
})
export class ServiciosList {
  private readonly serviciosService = inject(ServicioService);
  private readonly servProfesional = inject(ProfesionalService);
  private readonly catService = inject(CategoriaService);
  private readonly modService = inject(ModalityService);
  //Listar:
  servicios = signal<Servicio[]>([]);
  //Filtro de busqueda
  search = signal('');
  //Indicador de carga
  loading = signal(false);
  //Error
  error = signal<string | null>(null);

  catId = signal<number | null>(null);
  cats = signal <categoria[] | null>(null);

  modId = signal<string | null>(null);
  modss = signal <Modality[] | null>(null);

  precioMinimo = signal <number | null>(0);
  precioMaximo = signal <number | null>(10000);
  
  ngOnInit(): void {
    this.listarCategorias();
    this.listarModality();
    this.loadServicios();
  }

  listarModality(): void {
    this.modService.listar().subscribe({
      next: (response) => {
        this.modss.set(response.data);
      }
    })
  }

  listarCategorias(): void {
    this.catService.listar().subscribe({
      next: (response) => {
        this.cats.set(response.data);
      }
    })
  }

  loadServicios(): void {
  this.loading.set(true);
  this.error.set(null);

  this.catService.listar().subscribe({
    next: (catResponse) => {
      const listaCats = catResponse.data;

        this.servProfesional.listar().subscribe({
          next: (profesionalesResponse) => {
            const listaProfesionales = profesionalesResponse.data;

              this.serviciosService.listar().subscribe({
                next: (serviciosResponse) => {
                  const listaServiciosRaw = serviciosResponse.data;
                  const serviciosProcesados: any[] = [];

                    listaServiciosRaw.forEach((servicio: any) => {
                      const profesionalEncontrado = listaProfesionales.find(
                      (p: any) => p.id === servicio.profesionalId);
                      const categoriaEncontrada = listaCats.find(
                        (c: any) => c.id === servicio.categoriaId);

                      const servicioModificado = {
                        ...servicio,
                        nombreProfesional: profesionalEncontrado? `${profesionalEncontrado.nombre} ${profesionalEncontrado.apellido}`: 'No asignado',
                        nombreCategoria: categoriaEncontrada? `${categoriaEncontrada.nombre}` : 'No encontrada'};

                    serviciosProcesados.push(servicioModificado);
                    });

                      this.servicios.set(serviciosProcesados);
                      this.loading.set(false);
                      console.log('Servicios con profesionales cargados:', serviciosProcesados);
                },
                  error: () => {this.error.set('No se pudieron cargar los servicios.');
                  this.loading.set(false);
            }
        });
    },
  })},});
}
  Filtrados = computed(() => {
    const text = this.search().trim().toLowerCase();
    const selectedMod = this.modId();
    const selectedCategory = this.catId();
    const min = this.precioMinimo() !== null ? Number(this.precioMinimo()) : 0;
    const max = this.precioMaximo() !== null ? Number(this.precioMaximo()) : Infinity;
    return this.servicios().filter((servicio) => {
      const nombre = servicio.nombre?.toLocaleLowerCase() ?? '';
      const descripcion = servicio.descripcion?.toLowerCase() ?? '';
      const coincidencia = text.length === 0 || nombre.includes(text) || descripcion.includes(text);
      const coincideMod = !selectedMod || servicio.modality === selectedMod;
      const coincideCat = !selectedCategory || servicio.categoriaId === selectedCategory;
      const coincideRango = Number(servicio.precio) >= min && Number(servicio.precio) <= max;
      return coincidencia && coincideMod && coincideCat && coincideRango;
    });
  })

  total = computed(() => this.Filtrados().length);

}
