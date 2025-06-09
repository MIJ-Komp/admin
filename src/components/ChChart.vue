<template>
   <div class="cardp">
      <Chart
         :type="chartType"
         :data="modelValue"
         :options="chartOptions"
         :class="chartClass"
         style="height: 300px"
      />
   </div>
</template>

<script>
import Chart from "primevue/chart";
export default {
   components: { Chart },
   props: {
      modelValue: { type: Object, default: () => {} },
      chartType: {
         type: String,
         default: "bar",
      },
      chartClass: {
         type: String,
         default: "",
      },
      chartOptions: {
         type: Object,
         default: {
            maintainAspectRatio: false,
            aspectRatio: 1,
            plugins: {
               legend: {
                  labels: {
                     color: '"#000"',
                  },
               },
            },
            scales: {
               x: {
                  ticks: {
                     color: '"#000"',
                  },
                  grid: {
                     color: '"#000"',
                  },
               },
               y: {
                  ticks: {
                     color: '"#000"',
                  },
                  grid: {
                     color: '"#000"',
                  },
               },
            },
         },
      },
   },
};
</script>
