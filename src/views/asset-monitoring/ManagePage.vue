<template>
    <h4>Manage</h4>

    <div class="row mt-3">
        <div class="col-md-4">
            <router-link :to="{ name: 'asm:alarm_settings' }" style="text-decoration: none">
                <div class="card border h-100 border-success">
                    <div class="card-body">
                        <div class="card-title">SUBSCRIBER</div>
                    </div>
                </div>
            </router-link>
        </div>
        <div class="col-md-4">
            <router-link :to="{ name: 'asm:asset' }" style="text-decoration: none">
                <div class="card border h-100 border-success">
                    <div class="card-body">
                        <div class="card-title">ASSETS</div>
                    </div>
                </div>
            </router-link>
        </div>
        <!-- TICKETING PHASE 2 -->
        <!-- <div class="col-md-4">
            <router-link :to="{ name: 'asm:asset' }" style="text-decoration: none">
                <div class="card border h-100 border-success">
                    <div class="card-body">
                        <div class="card-title">TICKETING</div>
                    </div>
                </div>
            </router-link>
        </div> -->
    </div>
</template>

<script setup>

</script>
