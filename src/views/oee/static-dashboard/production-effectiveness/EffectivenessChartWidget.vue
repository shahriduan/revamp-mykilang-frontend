<template>
    <div>
        <div v-if="props.parentProps && props.parentProps.length">
            <div v-for="(machine, index) in props.parentProps" :key="index.machine_id">
                <div class="card mb-2 mt-1">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-lg-9">
                                <div class="fw-bold h4">Machine: {{ machine.machine_name }}</div>
                            </div>
                            <div class="col-lg-3">
                                <div style="font-size: medium;">Overall Product Produced:
                                    <div>
                                        <span class="fw-medium h4" data-echart-responsive="true">{{ machine.total_actual_quantity }}</span> Pcs / 
                                        <span>{{ machine.total_plan_quantity }} Pcs</span>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                        <div v-for="time in machine.total_time" :key="time.name">
                            <div class="fw-bold">{{ getDisplayTitle(time.name) }}</div>
                            <div class="w-100">
                                <div class="row">
                                    <div class="col-auto d-flex align-items-center pe-2">
                                        <span class="dot" :style="{ backgroundColor: getCategoryColor(time.name) }"></span>
                                        <span>{{ time.name }}</span>
                                    </div>
                                    <!-- Only render red dot and label for availability, performance, and quality -->
                                    <div v-if="time.name !== 'Planned Production Time'" class="col-auto d-flex align-items-center">
                                        <span class="dot" :style="{ backgroundColor: getDotColor(time.name, 1) }"></span>
                                        <span>{{ getLossLabel(time.name, 1) }}</span>
                                    </div>
                                </div>
                                <div class="progress-stacked">
                                    <div v-for="(progress, index) in getProgressBars(time)" 
                                        :key="index" class="progress" :style="{ width: progress.width }" role="progressbar"
                                        :aria-valuenow="progress.value" aria-valuemin="0" aria-valuemax="100">
                                        <div class="progress-bar" :style="{ backgroundColor: progress.color }">
                                            {{ progress.value }} %
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            No data available.
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    parentProps: {
        required: true,
        type: Object
    }
})

const getDisplayTitle = (name) => {
    switch (name) {
        case 'Planned Production Time':
            return 'Total Time';
        case 'Run Time':
            return 'Availability';
        case 'Net Run Time':
            return 'Performance';
        case 'Fully Productive Time':
            return 'Quality';
        default:
            return name;
    }
};

const getCategoryColor = (name) => {
    return '#0066FF';
}

const getDotColor = (categoryName, index) => {
    return index === 0 ? '#0066FF' : '#B41313';
};

const getLossLabel = (categoryName, index) => {
    switch (categoryName) {
        case 'Run Time':
            return 'Availability Loss';
        case 'Net Run Time':
            return 'Performance Loss';
        case 'Fully Productive Time':
            return 'Quality Loss';
        default:
            return '';
    }
};

const getProgressBars = (time) => {
    const progressBars = [];

    if (time.remaining_value !== undefined) {
        progressBars.push({
            value: time.remaining_value.toFixed(2),
            width: time.remaining_value.toFixed(2) + '%',
            color: '#0066FF' // Blue color
        });
    }

    if (time.availability_loss !== undefined) {
        progressBars.push({
            value: time.availability_loss.toFixed(2),
            width: time.availability_loss.toFixed(2) + '%',
            color: '#B41313' // Red color
        });
    }

    if (time.performance_loss !== undefined) {
        progressBars.push({
            value: time.performance_loss.toFixed(2),
            width: time.performance_loss.toFixed(2) + '%',
            color: '#B41313' // Red color
        });
    }

    if (time.quality_loss !== undefined) {
        progressBars.push({
            value: time.quality_loss.toFixed(2),
            width: time.quality_loss.toFixed(2) + '%',
            color: '#B41313' // Red color
        });
    }

    return progressBars;
};
</script>
