<template>
    <div class="card h-100">
        <div class="card-header d-flex align-items-center bg-body-tertiary py-1">
            <h6 class="mb-0 flex-1 text-center">Stock Location</h6>
            <button type="button" class="btn btn-link text-600 btn-sm" aria-label="Toggle Orientation" @click="toggleOrientation">
                <i class="bi bi-gear-wide-connected">Toggle Orientation</i>
            </button>
        </div>
        <div class="card-body p-2">
            <div v-if="parentProps && parentProps.warehouse_stocks" class="container" :class="['container', orientation]">
                <div v-for="(stock, index) in parentProps.warehouse_stocks" :key="index" :class="['stock-card']" :style="{ backgroundColor: getColorShade(stock.quantity) }">
                    <span class="tooltiptext">
                        Product: {{ stock.product }} <br> Total Quantity: {{ stock.total_quantity }}
                    </span>
                </div>
                <div v-for="n in emptyCardsCount" :key="'empty-' + n" class="stock-card empty"><span></span></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, nextTick } from 'vue'

const props = defineProps({
    parentProps: {
        required: true,
        type: Object
    }
})

const orientation = ref('horizontal')

const toggleOrientation = () => {
    orientation.value = orientation.value === 'horizontal' ? 'vertical' : 'horizontal'
    calculateEmptyCards()
}

const maxQuantity = computed(() => {
    return Math.max(...props.parentProps.warehouse_stocks.map(stock => stock.quantity))
})

const getColorShade = (quantity) => {
    const max = maxQuantity.value
    const step = max / 5
    let opacity = 0.2

    if (quantity >= 4 * step) {
        opacity = 1.0;
    } else if (quantity >= 3 * step) {
        opacity = 0.8;
    } else if (quantity >= 2 * step) {
        opacity = 0.6;
    } else if (quantity >= step) {
        opacity = 0.4;
    }

    return `rgba(30, 144, 255, ${opacity})`;
}

const initializeTooltips = () => {
    setTimeout(() => {
        const tooltips = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'));
        tooltips.forEach((tooltip) => {
            new bootstrap.Tooltip(tooltip);
        })
    }, 0)
}

onMounted(() => {
    initializeTooltips()
    calculateEmptyCards()
});

watch(() => props.parentProps.warehouse_stocks, () => {
    initializeTooltips()
    calculateEmptyCards()
})

const emptyCardsCount = ref(0);

const calculateEmptyCards = () => {
    nextTick(() => {
        requestAnimationFrame(() => {
            if (!props.parentProps.warehouse_stocks || props.parentProps.warehouse_stocks.length === 0) {
                emptyCardsCount.value = 0;
                return;
            }

            const container = document.querySelector('.card-body');
            if (!container) {
                emptyCardsCount.value = 0;
                return;
            }

            const containerWidth = container.clientWidth;
            const cardWidth = 110;
            const cardsPerRow = Math.max(16, Math.floor(containerWidth / cardWidth));
            const numStocks = props.parentProps.warehouse_stocks.length;
            const remainder = numStocks % cardsPerRow;

            emptyCardsCount.value = remainder === 0 ? 0 : cardsPerRow - remainder;
        })
    })
}

window.addEventListener('resize', calculateEmptyCards)
</script>

<style scoped>
.container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 20px;
    border-radius: 4px;
}

.horizontal {
    flex-direction: row;
}

.vertical {
    flex-direction: column;
    max-height: 200px;
    overflow-y: auto;  /* Enable scrolling if needed */
    flex-wrap: wrap;
    gap: 5px;
}

.empty {
    border: 1px solid rgba(0, 0, 0, 0.1);
}

.stock-card {
    font-size: 14px;
    border-radius: 4px;
    box-sizing: border-box;
    position: relative;
    width: 40px;
    height: 40px;
}

.stock-card .tooltiptext {
    visibility: hidden;
    width: 200px;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    z-index: 1;
    bottom: 10px;
    left: 50px;
    opacity: 0;
    transition: opacity 0.3s;
}

.stock-card:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
}
</style>