<template>
    <div class="row mb-0">
        <div class="card d-flex align-items-center rounded-0 shadow-none" style="background-color: #152b48;">
            <h5 class="text-light">Main Menu</h5>
        </div>
    </div>

    <div class="row g-3 mt-1">
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 mb-2 text-center">
            <router-link :to="{ name:'apiw.warehouse' }" style="text-decoration: none;">
            <div class="card border shadow-none h-100">
                <div class="card-img-top m-0">
                    <img class="img-medium" src="/img/supply-chain/warehouse.png" style="width: 50%; height: auto" />
                </div>
                <div class="card-body p-1">
                    <h5 class="card-title text-center">Warehouse</h5>
                </div>
            </div>
            </router-link>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 mb-2 text-center">
            <router-link :to="{ name: 'apiw.production' }" style="text-decoration: none;">
            <div class="card border shadow-none h-100">
                <div class="card-img-top m-0">
                    <img class="img-fluid" src="/img/supply-chain/production.png" style="width: 50%; height: auto" />
                </div>
                <div class="card-body p-1">
                    <h5 class="card-title text-center">Production</h5>
                </div>
            </div>
            </router-link>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 mb-2 text-center">
            <router-link :to="{ name: 'apiw.asset' }" style="text-decoration: none;">
            <div class="card border shadow-none h-100">
                <div class="card-img-top m-0">
                    <img class="img-fluid" src="/img/supply-chain/asset.png" style="width: 50%; height: auto" />
                </div>
                <div class="card-body p-1">
                    <h5 class="card-title text-center">Asset</h5>
                </div>
            </div>
            </router-link>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3 mb-2 text-center">
            <router-link :to="{ name: 'apiw.inventory' }" style="text-decoration: none;">
            <div class="card border shadow-none h-100">
                <div class="card-img-top m-0">
                    <img class="img-fluid" src="/img/supply-chain/inventory.png" style="width: 50%; height: auto" />
                </div>
                <div class="card-body p-1">
                    <h5 class="card-title text-center">Inventory</h5>
                </div>
            </div>
            </router-link>
        </div>
    </div>

</template>

<script setup>

</script>
