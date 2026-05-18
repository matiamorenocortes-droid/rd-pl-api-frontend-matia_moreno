<template>
  <div class="container my-5">
    <header class="text-center mb-5 p-4 bg-dark text-white rounded shadow">
      <h1>Radio Deportes - Panel Administrativo</h1>
      <p class="lead m-0">Historial de Futbolistas Destacados de la Premier League</p>
    </header>

    <div class="row">      
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h5 class="m-0">{{ editando ? 'Editar Futbolista' : 'Registrar Nuevo Futbolista' }}</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="guardarFutbolista">
              <div class="mb-3">
                <label class="form-label">Nombre del Jugador</label>
                <input type="text" class="form-control" v-model="form.nombre" required placeholder="Ej: Steven Gerrard">
              </div>
              <div class="mb-3">
                <label class="form-label">Club de la Premier</label>
                <input type="text" class="form-control" v-model="form.equipo" required placeholder="Ej: Liverpool FC">
              </div>
              <div class="mb-3">
                <label class="form-label">Posición</label>
                <input type="text" class="form-control" v-model="form.posicion" required placeholder="Ej: Centrocampista">
              </div>
              <button type="submit" class="btn btn-success w-100">
                {{ editando ? 'Actualizar' : 'Guardar en la Nube' }}
              </button>
              <button type="button" v-if="editando" class="btn btn-secondary w-100 mt-2" @click="cancelarEdicion">
                Cancelar
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- TABLA CON EL LISTADO DE JUGADORES (READ) -->
      <div class="col-md-8">
        <div class="card shadow-sm">
          <div class="card-header bg-dark text-white">
            <h5 class="m-0">Base de Datos de Jugadores</h5>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover m-0">
                <thead class="table-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Equipo</th>
                    <th>Posición</th>
                    <th class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="jugador in futbolistas" :key="jugador._id">
                    <td><strong>{{ jugador.nombre }}</strong></td>
                    <td>{{ jugador.equipo }}</td>
                    <td><span class="badge bg-secondary">{{ jugador.posicion }}</span></td>
                    <td class="text-center">
                      <button class="btn btn-sm btn-warning me-2" @click="cargarEdicion(jugador)">Editar</button>
                      <button class="btn btn-sm btn-danger" @click="eliminarFutbolista(jugador._id)">Eliminar</button>
                    </td>
                  </tr>
                  <tr v-if="futbolistas.length === 0">
                    <td colspan="4" class="text-center text-muted py-4">No hay registros guardados en MongoDB Atlas. ¡Agrega el primero!</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import clienteAxios from './api.js';

export default {
  data() {
    return {
      futbolistas: [],
      editando: false,
      idSeleccionado: null,
      form: {
        nombre: '',
        equipo: '',
        posicion: ''
      }
    };
  },
  mounted() {
    this.obtenerFutbolistas();
  },
  methods: {    
    async obtenerFutbolistas() {
      try {
        const respuesta = await clienteAxios.get('/futbolistas'); 
        this.futbolistas = respuesta.data;
      } catch (error) {
        console.error("Error al traer los datos:", error);
      }
    },    
    async guardarFutbolista() {
      try {
        if (this.editando) {
          await clienteAxios.put(`/futbolistas/${this.idSeleccionado}`, this.form);
        } else {
          await clienteAxios.post('/futbolistas', this.form);
        }
        this.cancelarEdicion();
        this.obtenerFutbolistas();
      } catch (error) {
        console.error("Error al guardar:", error);
      }
    },
    // DELETE: Eliminar registro
    async eliminarFutbolista(id) {
      if (confirm("¿Seguro que deseas eliminar este registro histórico?")) {
        try {
          await clienteAxios.delete(`/futbolistas/${id}`);
          this.obtenerFutbolistas();
        } catch (error) {
          console.error("Error al eliminar:", error);
        }
      }
    },
    cargarEdicion(jugador) {
      this.editando = true;
      this.idSeleccionado = jugador._id;
      this.form = { nombre: jugador.nombre, equipo: jugador.equipo, posicion: jugador.posicion };
    },
    cancelarEdicion() {
      this.editando = false;
      this.idSeleccionado = null;
      this.form = { nombre: '', equipo: '', posicion: '' };
    }
  }
};
</script>