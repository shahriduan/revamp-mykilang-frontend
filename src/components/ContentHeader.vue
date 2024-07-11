<template>
    <div class="row">
        <div class="col-md-9">
            <h4>{{ title }}</h4>
            <nav style="--falcon-breadcrumb-divider: '»';" aria-label="breadcrumb" v-if="breadcrumbs != undefined">
                <ol class="breadcrumb">
                    <li 
                        class="breadcrumb-item" 
                        :class="{ 'active': breadcrumb.route == undefined }" 
                        :aria-current="breadcrumb.route == undefined ? 'page' : ''" 
                        v-for="breadcrumb in breadcrumbs">

                        <span v-if="breadcrumb.route == undefined">
                            {{ breadcrumb.name }}
                        </span>
                        <router-link :to="breadcrumb.route" v-else>
                            {{ breadcrumb.name }}
                        </router-link>
                    </li>
                </ol>
            </nav>
        </div>
        <div class="col-md-3 align-self-end text-end">
            <x-back-button :route="previousRoute" class="d-none d-md-block" v-if="previousRoute != undefined" />
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    title: String,
    breadcrumbs: Array,
    
    // Using vue router object
    // Example: { name: 'routeName', params: { id: 1 } }
    previousRoute: Object
})
</script>

<!-- 
    This is an example on how to use this component

    <x-content-header 
        title="My title"
        :breadcrumbs="[
            { route: { name: 'console:client_account.index'}, name: 'Client Accounts' }, 
            { route: { name: 'console:client_account.license_key.index', params: { company: $route.params.company }, query: { name: $route.query.name } }, name: $route.query.name + ' Licenses' }, 
            { name: $route.params.action == 'create' ? 'New License Key' : 'Edit License Key' }
        ]"
        :previous-route="{ name: 'console:client_account.license_key.index', params: { company: $route.params.company }, query: { name: $route.query.name } }"
    />
 -->