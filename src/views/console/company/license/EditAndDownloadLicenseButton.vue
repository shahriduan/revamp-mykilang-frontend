<template>
    <router-link :to="{ name: 'console:client_account.license_key.form', params: { company: $route.params.company, action: 'edit', license: licenseId  }, query: { name: $route.query.name } }" class="btn btn-outline-dark btn-sm me-2" v-if="$can('license_key.edit')">
        <i class="fas fa-pencil me-2"></i> Edit
    </router-link>
    <button class="btn btn-outline-primary btn-sm" @click="downloadLicenseKey(licenseKey, licenseFilename)">
        <i class="fa-solid fa-download me-2"></i> License Key
    </button>
    <span v-if="authStore.userProfile.user_type == ConstantConfig.userType.hq">
        <router-link :to="{ name: 'console:client_account.unpair_license_key.form', params: { company: $route.params.company, license: licenseId }, query: { name: $route.query.name } }" class="btn btn-outline-danger btn-sm ms-2" v-if="licenseDeviceId && $can('license_key.unpair')">
            <i class="fa-solid fa-key me-2"></i> Unpair Key
        </router-link>
    </span>
    <span v-if="authStore.userProfile.user_type == ConstantConfig.userType.client">
        <router-link :to="{ name: 'console:unpair_license_key.form', params: { license: licenseId } }" class="btn btn-outline-danger btn-sm ms-2" v-if="licenseDeviceId && $can('license_key.unpair')">
            <i class="fa-solid fa-key me-2"></i> Unpair Key
        </router-link>
    </span>
</template>

<script setup>
import { useAuthStore } from '@/stores/AuthStore'
import ConstantConfig from '@/config/ConstantConfig'

const authStore = useAuthStore()

const props = defineProps({
    licenseFilename: String,
    licenseKey: String,
    licenseId: Number,
    licenseDeviceId: String,
})

function downloadLicenseKey(license_key, filename) {
    const textBlob = new Blob([license_key], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(textBlob);
    link.download = filename;
    link.click();
}
</script>
