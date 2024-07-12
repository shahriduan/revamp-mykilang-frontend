export default class ConstantConfig {
    /********************
     * General Constant *
     ********************/
    // Key value inside local storage
    static get localStorageKey() {
        return {
            token: 'token',
            permissionStore: 'permissionStore',
            userProfile: 'userProfile',
            theme: 'theme',
            currentModule: 'currentModule'
        }; 
    }

    // Enum value inside table users column user_type
    static get userType() {
        return {
            client: 'Client',
            hq: 'HQ'
        }
    }

    static get moduleCode() {
        return {
            oee: 'OEE',
            spc: 'SPC',
        }
    }

    // Key value inside cookies
    static get appCookie() {
        return {
            oee: {
                mainDashboardDateFilter: 'oee|main_dashboard|date_filter',
                mainDashboardProductionLineFilter: 'oee|main_dashboard|production_line_filter',
                mainDashboardTimeframeFilter: 'oee|main_dashboard|timeframe_filter',
                oeeIndicatorDateFilter: 'oee|oee_indicator|date_filter',
                oeeIndicatorProductionLineFilter: 'oee|oee_indicator|production_line_filter',
                oeeBatchDateFilter: 'oee|oee_batch|date_filter',
                oeeBatchProductionLineFilter: 'oee|oee_batch|production_line_filter',
                oeeProductionBatchDateFilter: 'oee|production_batch|date_filter',
                oeeProductionBatchProductionLineFilter: 'oee|production_batch|production_line_filter',
                effectivenessDateFilter: 'oee|production_effectiveness|date_filter',
                effectivenessProductionLineFilter: 'oee|production_effectiveness|production_line_filter',
            }
        }
    }

    /****************
     * OEE Constant *
     ****************/
    // OEE widget code
    static get widgetCode() {
        return {
            planProductionTime: 'PLPDT',
            runTime: 'RUNTI',
            netRunTime: 'NETRT',
            teepScore: 'TEEPSC',
            shiftHours: 'SHIHO',
            availabilityLoss: 'AVLOS',
            performanceLoss: 'PFLOS',
            qualityLoss: 'QLLOS',
            downtimeDepartment: 'DNDEP',
            downtimeCause: 'DNCAU',
            operationHourStation: 'THOPR',
            operationHourPart: 'THOPR',
            hoursOperated: 'THOPR'
        }
    }

    // OEE widget filter type
    static get getDateFilterType() {
        return {
            today: 'TODAY',
            lastMonth: 'LAST_MONTH',
            last3Month: 'LAST_3_MONTHS',
            last6Month: 'LAST_6_MONTHS',
            lastYear: 'LAST_YEAR',
            customRange: 'CUSTOM_RANGE',
            customDay: 'CUSTOM_DAY'
        }
    }

    // OEE widget data type
    static get dataType() {
        return {
            Stations: 'ProductionLine',
            Parts: 'ConfigPart'
        }
    }
}