<template>
  <div class="month">
    <ul>
      <li class="prev">
        <li class="fontsize">{{ props.year }}. {{ props.month }}</li>
      </li>
      <li class="next">
        <button @click="calenderData(-1)">
          <img src="@/assets/img/common/ico_arrowRight2.png" alt="leftarrow" style="transform: rotate(180deg)"/>
        </button>
        <button @click="getToday">금일</button>
        <button @click="calenderData(1)">
          <img src="@/assets/img/common/ico_arrowRight2.png" alt="rightarrow" />
        </button>
        <input v-if="props.calenderType=='month'" class="datepicker" type="month"
          :value="props.selectedMonth"
          @change="updateMonth"
        />
        <input v-else-if="props.calenderType=='week'" class="datepicker" type="week"
          :value="props.selectedWeek"
          @change="updateMonth"
        />
        <select :value="props.calenderType" class="selectBox" @change="updateCalenderType">
          <option v-for="(item, idx) in selectBoxOption" :value="item.value">{{ item.label }}</option>
        </select>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref } from 'vue';
import { diffMonth } from "@/components/rest/schedule/ScheduleDashBoardRest";
import { type scheduleData } from "@/components/type/schedule";

const props = defineProps({
  events: Object as PropType<scheduleData[]>,
  selectedMonth: String,
  selectedWeek: String,
  year: Number,
  month: Number,
  calenderType: String,
});

const labelButton = {
  month: "금월",
  week: "금주",
  day: "금일",
}

const selectBoxOption = [
    {label: '월', value: 'month'},
    {label: '주', value: 'week'},
    {label: '일', value: 'day'}
  ];
const calenderType = ref("month");
const emit = defineEmits(['update:selected-month', 'update:calender-type', 'calender-data', 'get-today']);

// function
function calenderData(arg: number) {
  console.log(arg)
  emit('calender-data', arg);
}

function getToday() {
  emit("get-today");
}

function updateCalenderType(e: Event) {
  const element = e.target as HTMLInputElement;
  emit('update:calender-type', element.value);
}

function updateMonth(e: Event) {
  const element = e.target as HTMLInputElement;
  console.log(e);
  let arg;
  if(props.calenderType == "month") {
    arg = diffMonth(new Date(element.value+'-01'), new Date(props.year as number, props.month as number, 1));
  } else if(props.calenderType == "week") {
    arg = calWeek(weekToDate(props.selectedWeek as string), weekToDate(element.value));
  }

  calenderData(arg as number);
}

function weekToDate(v: string) {
  const year = parseInt(v.split("-")[0]);
  const week = parseInt(v.split("W")[1]);
  const d = new Date(year, 0, 1);
  const w = d.getTime() + 604800000 * (week - 1);
  const date = new Date(w);
  return date;
}

function calWeek(date1: Date, date2: Date) {

  var sdt = new Date(date1);
  var edt = new Date(date2);
  var dateDiff = Math.ceil((edt.getTime()-sdt.getTime())/(1000*3600*24));

  return Math.ceil(dateDiff / 7);
}

</script>

<style lang="scss" scoped>
.calendarLayout {
  border: 1px solid #d7d7d7;
  // border-radius: 8px 8px 0 0;
  border-radius: 8px;
  background-color: white;
  padding-bottom: 1em;

  ul {
    list-style-type: none;
  }

  .month {
    width: 100%;
    text-align: center;
    padding: 0.5em;
    height: 55px;
    .next {
      float: right;
      padding-top: 0.3em;
      input {
        height: 30px;
      }
    }
    .prev {
      float: left;
      padding-top: 0.3em;
    }

    button {
      border: none;
      background-color: white;
      cursor: pointer;
      height: 30px;
    }

    input {
      border: 1px solid #d7d7d7;
      border-radius: 8px;
      height: 30px;
    }
    
    select {
      border: 1px solid #d7d7d7;
      border-radius: 8px;
      height: 30px;
      width: 80px;
      padding: 0px 15px;
      background: url(@/assets/img/common/ico_selectBoxArrow.png) no-repeat calc(100% - 5px) / contain;
      background-size: 16px;
    }

    .fontsize {
      font-size: 1.5em;
      font-weight: bold;
    }
  }

}
</style>
