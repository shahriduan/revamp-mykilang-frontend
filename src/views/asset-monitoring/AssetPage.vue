<template>
    <h4 class="text-decoration-underline">Asset</h4>

    <div class="mt-2 mb-2">
        <NavbarVerticalDivider>List of Assets</NavbarVerticalDivider>
    </div>

    <div class="row gy-2 gy-sm-0">
        <div class="col-md-3 col-lg-6 col-xxl-6"></div>
        <div class="col-12 col-sm-6 col-md-5 col-lg-3 col-xxl-3 pe-sm-2">
            <div class="input-group me-3">
                <span class="input-group-text" id="search"><i class="fa-solid fa-magnifying-glass"></i></span>
                <input type="text" class="form-control" placeholder="Search" aria-label="Seacrh"
                    aria-describedby="search" v-model="search" @keyup="debounceSearch">
            </div>
        </div>
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xxl-3 ps-sm-2">
            <div class="d-flex">
                <button class="btn btn-outline-primary shadow-none m-1" type="button">
                    <i class="bi bi-funnel-fill"></i>
                </button>
                <button class="btn btn-outline-primary shadow-none m-1" type="button">
                    <i class="bi bi-sliders"></i>
                </button>
                <button class="btn btn-outline-primary shadow-none m-1" type="button" data-bs-toggle="modal" data-bs-target="#error-modal">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-outline-primary shadow-none m-1" type="button">
                    <i class="bi bi-download"></i>
                </button>
            </div>
        </div>
    </div>

    <div class="modal fade" id="error-modal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document" style="max-width: 800px">
            <div class="modal-content position-relative">
                <div class="position-absolute top-0 end-0 mt-2 me-2 z-1">
                    <button class="btn-close btn btn-sm btn-circle d-flex flex-center transition-base"
                        data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-0">
                    <div class="rounded-top-3 py-3 ps-4 pe-6 bg-body-tertiary">
                        <h4 class="mb-1" id="modalExampleDemoLabel">Edit Asset </h4>
                    </div>
                    <div class="p-4 pb-0">
                        <form>
                            <div class="mb-1">
                                <label class="col-form-label" for="recipient-name">Department:</label>
                                <input class="form-control" id="recipient-name" type="text" />
                            </div>
                            <div class="mb-1">
                                <label class="col-form-label" for="message-text">Type Asset:</label>
                                <input class="form-control" id="message-text" type="text" />
                            </div>
                            <div class="mb-1">
                                <label class="col-form-label" for="message-text">Asset Location:</label>
                                <input class="form-control" id="message-text" type="text" />
                            </div>
                            <div class="mb-1">
                                <label class="col-form-label" for="message-text">Serial Number:</label>
                                <input class="form-control" id="message-text" type="text" />
                            </div>
                            <div class="mb-1">
                                <label class="col-form-label" for="message-text">Purchase Date:</label>
                                <input class="form-control" id="message-text" type="text" />
                            </div>
                            <div class="mb-1">
                                <label class="col-form-label" for="message-text">L.M Date:</label>
                                <input class="form-control" id="message-text" type="text" />
                            </div>
                            <div class="mb-1">
                                <label class="col-form-label" for="message-text">N.M Date:</label>
                                <input class="form-control" id="message-text" type="text" />
                            </div>
                            <div class="mb-1">
                                <label class="col-form-label" for="message-text">Remarks:</label>
                                <input class="form-control" id="message-text" type="text" />
                            </div>
                            <div class="mb-3">
                                <label class="col-form-label" for="message-text">Status:</label>
                                <div class="switch-wrapper">
                                    <label class="switch">
                                        <input type="checkbox" v-model="toggleState" />
                                        <span class="slider round"></span>
                                    </label>
                                    <span class="switch-label" v-if="toggleState">OK</span>
                                    <span class="switch-label" v-else>NOT</span>
                                </div>
                            </div>
                            
                        </form>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Close</button>
                    <button class="btn btn-primary" type="button">Update </button>
                </div>
            </div>
        </div>
    </div>

    <div class="mt-1" id="app">
        <div class="table-responsive mt-2">
            <table class="table border-bottom scrollbar text-center">
                <thead>
                    <tr>
                        <th scope="col">
                            <input class="form-check-input" type="checkbox" id="selectAll" @click="selectAll()">
                        </th>
                        <th scope="col">No.</th>
                        <th scope="col">Department</th>
                        <th scope="col">Type Asset</th>
                        <th scope="col">Asset Location</th>
                        <th scope="col">Serial Number</th>
                        <th scope="col">Purchase Date</th>
                        <th scope="col">L.M Date</th>
                        <th scope="col">N.M Date</th>
                        <th scope="col">Remarks</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input type="checkbox" class="form-check-input row-checkbox" /></td>
                        <td>1</td>
                        <td>PP</td>
                        <td>Welding</td>
                        <td>Block A</td>
                        <td>W201908423011</td>
                        <td>10/01/2024</td>
                        <td>10/05/2024</td>
                        <td>10/05/2024</td>
                        <td>Blade change</td>
                        <td class="align-middle">
                            <span class="badge rounded-pill bg-success">OK</span>
                        </td>
                    </tr>
                    <tr>
                        <td><input type="checkbox" class="form-check-input row-checkbox" /></td>
                        <td>2</td>
                        <td>PP</td>
                        <td>Welding</td>
                        <td>Block A</td>
                        <td>W201908423011</td>
                        <td>10/01/2024</td>
                        <td>10/05/2024</td>
                        <td>10/05/2024</td>
                        <td>Blade change</td>
                        <td>
                            <span class="badge rounded-pill bg-success">OK</span>
                        </td>
                    </tr>
                    <tr>
                        <td><input type="checkbox" class="form-check-input row-checkbox" /></td>
                        <td>3</td>
                        <td>PP</td>
                        <td>Welding</td>
                        <td>Block B</td>
                        <td>W201908423011</td>
                        <td>10/01/2024</td>
                        <td>10/05/2024</td>
                        <td>10/05/2024</td>
                        <td>Blade change</td>
                        <td>
                            <span class="badge rounded-pill bg-danger">NOT</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

</template>

<script setup>
import { ref } from 'vue'
import NavbarVerticalDivider from '@/layouts/_shared/NavbarVerticalDivider.vue'

const search = ref('')
const toggleState = ref(false)

function selectAll() {
    const selectAllCheckbox = document.getElementById('selectAll')
    const rowCheckbox = document.querySelectorAll('.row-checkbox')
    rowCheckbox.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked
    })
}
</script>

<style scoped>
.switch-wrapper {
  display: flex;
  align-items: center;
  gap: 5px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
  margin-right: 10px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e91515;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #41c13d;
}

input:focus + .slider {
  box-shadow: 0 0 1px #41c13d;
}

input:checked + .slider:before {
  transform: translateX(20px); /* Adjusted transform */
}

/* Rounded sliders */
.slider.round {
  border-radius: 20px;
}

.slider.round:before {
  border-radius: 50%;
}

.switch-label {
  font-size: 16px;
  font-weight: bold;
  margin-top: -10px;
}
</style>