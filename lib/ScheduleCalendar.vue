<template>
  <section class="calendarLayout" style="height: 90%">
    <Header 
      @calender-data="calenderData" 
      @get-today="getToday" 
      :year="year"
      :month="month"
      v-model:calenderType="calenderType"
      v-model:selectedMonth="selectedMonth"
      v-model:selectedWeek="selectedWeek"
    ></Header>
    <!-- {{ calenderType }}{{ selectedMonth }} -->
    <div class="mainLayout">
      <Month 
        v-if="calenderType=='month'"
        :events="props.events"
        :year="year"
        :month="month"
        @click-day="clickDay"
        @click-event="onClickEvent"
        @edit-event="emit('edit-event', $event)"
        @save-event="emit('save-event', $event)"
        @delete-event="emit('delete-event', $event)"
        @update-day="emit('update-day', $event)"
      />
      <Week
        v-if="calenderType=='week'"
        :events="props.events"
        :year="year"
        :month="month"
        :selectedWeek="selectedWeek"
        :objDates="objDates"
        @click-day="clickDay"
        @click-event="onClickEvent"
        @edit-event="emit('edit-event', $event)"
        @save-event="emit('save-event', $event)"
        @delete-event="emit('delete-event', $event)"
        @update-day="emit('update-day', $event)"
      />
    </div>
    <SchedulePopup 
      :event="selectedEvent" 
      :config="config"
      :current-date="eventDate"
      @close-event="closeEvent"  
      @edit-event="editEvent"
      @delete-event="deleteEvent"
    ></SchedulePopup>
  </section>
</template>

<script lang="ts" setup>
import { PropType, onMounted, ref } from 'vue';
import SchedulePopup from './SchedulePopup.vue';
import Header from './ScheduleHeader.vue';
import Month from './ScheduleMonth.vue';
import Week from './ScheduleWeek.vue';
import { convertDatetoString, diffMonth } from "./ScheduleDashBoardRest";
import { type dateSet, type popupConfig, type restData, type scheduleData } from "./type/schedule";

const days = ["일", "월", "화", "수", "목", "금", "토"];
const currentYear = ref(0 as number);
const currentMonth= ref(0 as number);
const year = ref(0 as number);
const month = ref(0 as number);
const today = ref(0 as number);
const selectedDay = ref(0 as number);
const selectedEvent = ref({} as scheduleData);
const calenderType = ref("month" as string);
const config = ref({
  isVisible: false,
  isEditable: true,    // 수정 권한 여부
  readonly: true,      // 수정 여부
  title: "",          // 휴일 이름
  isUpdate: false,
} as popupConfig);
const eventDate = ref("" as string);
const objDates= ref([] as dateSet[]);
const selectedMonth = ref([new Date().getFullYear().toString(), (new Date().getMonth()+1).toString().padStart(2, "0")].join("-") as string);
const selectedWeek = ref('2024-W01' as string);
const props = defineProps({
  events: Object as PropType<scheduleData[]>
});
const emit = defineEmits(['click-day', 'click-event', 'edit-event', 'save-event', 'delete-event', 'update-day']);

onMounted(async () => {
  getToday();
  setWeekOfYear(new Date());
})

// watch(props, ()=>{
//   console.log(props.events)
//   if(props.events)
//     objDates.value = setEvents(getMonthOfDays(year.value, month.value));
// });

// function
function onClickEvent(date:string, e: scheduleData) {
  config.value.isVisible = !config.value.isVisible;
  
  if(!config.value.isVisible) {
    selectedEvent.value = {} as scheduleData;
    eventDate.value = "";
    return;
  }
  selectedEvent.value = e;
  eventDate.value = date;
  config.value.readonly = true;
  config.value.isUpdate = true;
  emit('click-event', e);
}

function closeEvent() {
  config.value.isVisible = false;
  config.value.isUpdate = false;
  selectedEvent.value = {} as scheduleData;
  eventDate.value = "";
}

function editEvent(e: restData) {
  console.log(e)
  if(config.value.isUpdate) {
    emit('edit-event', e);
  } else {
    emit('save-event', e);
  }
  closeEvent();
}

function deleteEvent(e: restData) {
  console.log(e)
  emit('delete-event', e);
  closeEvent();
}

function setWeekOfYear(date: Date) {
  let c = new Date(date);
  let s = new Date(c.getFullYear(), 0, 1);
  let days = Math.floor(((c as any) - (s as any)) /
    (24 * 60 * 60 * 1000));
 
  let weekNumber = Math.ceil(days / 7);

  selectedWeek.value = [c.getFullYear(), `W${weekNumber.toString().padStart(2, "0")}`].join("-");

}

function returnStrDate(year: number, month: number, day: number) {
  return [year.toString(), month.toString().padStart(2, '0'), day.toString().padStart(2, '0')].join('-');
}

function getToday() {
  const date = new Date();
  currentYear.value = date.getFullYear(); // 이하 현재 년, 월 가지고 오기
  currentMonth.value = date.getMonth() + 1;
  year.value = currentYear.value;
  month.value = currentMonth.value;
  today.value = date.getDate(); // 오늘 날짜
  selectedDay.value = date.getDate();
  selectedMonth.value = [year.value, month.value.toString().padStart(2, "0")].join("-");
  // objDates.value = getMonthOfDays(year.value, month.value);
  emit("update-day", getDate(year.value, month.value-1));
}

function getDate(year: number, month: number) {
  const date = new Date(year, month, 1);
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const date1 = new Date(date.getFullYear(), date.getMonth(), 1 - firstDay.getDay());
  const date2 = new Date(date.getFullYear(), date.getMonth(), lastDay.getDate()+lastDay.getDay());

  return {start: date1, end: date2};
}

function dayCount(day: number) {
  return (
    objDates.value[day].event?.length??0
  );
};

// day cell 클릭
async function clickDay(value: dateSet) {

  if (value.month != month.value) {
    calenderData(value.month - month.value);
    return;
  }
  selectedEvent.value = {} as scheduleData;
  eventDate.value = [value.year, value.month.toString().padStart(2, "0"), value.day.toString().padStart(2, "0")].join("-");
  selectedDay.value = value.day;
  year.value = value.year;

  config.value.isVisible = !config.value.isVisible;
  config.value.readonly = false;
  config.value.isUpdate = false;

  emit("click-day", value);
};

// 날짜 이동
function calenderData(arg: number) {
  console.log("calenderData", arg)
  closeEvent();

  if(calenderType.value == "month") {
    const current = new Date(year.value, month.value - 1);
    current.setMonth(current.getMonth() + arg);
    year.value = current.getFullYear();
    month.value = current.getMonth() + 1;
    selectedMonth.value = [year.value, month.value.toString().padStart(2, "0")].join("-");
    objDates.value= getMonthOfDays(year.value, month.value);
    emit("update-day", getDate(year.value, month.value-1));
  } else if (calenderType.value == "week") {
    year.value = parseInt(selectedWeek.value.split("-")[0]);
    const week = parseInt(selectedWeek.value.split("W")[1]) + arg;
    const d = new Date(year.value, 0, 1);
    const w = d.getTime() + 604800000 * (week - 1);
    const date1 = new Date(w);
    const date2 = new Date(w + 518400000);
    setWeekOfYear(date2);
    month.value = date2.getMonth() + 1;
    console.log(date1, selectedWeek.value);
    const param = {start: date1, end: date2};
    objDates.value= getWeekOfDays(date1, date2);

    emit("update-day", param);
  }
  
};

// 일자 설정
function getMonthOfDays(year: number, month: number) {
  const date = new Date(year, month - 1, 1);

  const firstDay = date.getDay(); // 이번 달 시작 요일
  date.setMonth(month);
  date.setDate(0);
  const lastDate = date.getDate(); // 이번달 마지막 날짜
  const lastDay = date.getDay(); // 이번달 마지막 요일
  
  date.setMonth(month - 1);
  date.setDate(0);
  const prevYear = date.getFullYear(); // 지난달 년도
  const prevLastDate = date.getDate(); // 지난 달 마지막 날짜

  const [monthFirstDay, monthLastDate, prevMonthLastDate] = [firstDay, lastDate, prevLastDate];
  const prevDay = prevMonthLastDate - monthFirstDay + 1;
  let objDates = [] as dateSet[];
  for (let j = prevDay; j <= prevMonthLastDate; j += 1) {
    objDates.push({ year: prevYear, month: month - 1, day: j });
  }
  for (let i = 1; i <= monthLastDate; i += 1) {
    objDates.push({ year: year, month: month, day: i });
  }
  for (let d = 1; d < 7 - lastDay; d += 1) {
    objDates.push({ year: year, month: month + 1, day: d });
  }
  return objDates;
};
function getWeekOfDays(date1: Date, date2: Date) {
  console.log("getWeekOfDays", date1, date2);
  let objDates = [] as dateSet[];
  let times = [{}];
  for(let i = 0; i < 24; i++) {
    times.push({time: i.toString().padStart(2, "0")});
  }

  for(let j = 0; j < 7; j++) {
    const year = date1.getFullYear();
    const month = date1.getMonth();
    const day = date1.getDate();
    const date = new Date(year, month, day + j);
    objDates.push({year: date.getFullYear(), month: date.getMonth()+1, day: date.getDate(), time: times});
  }


  console.log(objDates)
  return objDates;
};


// 일정 설정
// function setEvents(dates: dateSet[]) {
//   if(props.events?.length===0) {
//     return dates;
//   }

//   dates.forEach((e: dateSet, index: number) => {
//     let t = props.events?.filter((item) =>
//       new Date(convertDatetoString(item.schdtFrom)  + " 00:00") <= new Date(year.value, e.month-1, e.day)
//       && new Date(convertDatetoString(item.schdtTo) + " 00:00") >= new Date(year.value, e.month-1, e.day)
//     );
//     dates[index] = ({...e, event: t});
//   });
//   return dates;
// }
</script>

<style lang="scss" scoped>
.calendarLayout {
  border: 1px solid #d7d7d7;
  border-radius: 8px;
  background-color: white;
  padding-bottom: 1em;

  >.mainLayout {
    height: 100%;
  }

  ul {
    list-style-type: none;
  }

  .weekdays {
    display: grid;
    grid-template-columns: auto auto auto auto auto auto auto;
    // width: 100%;

    div {
      font-size: 1.1em;
      font-weight: bold;
      text-align: center;
    }
  }

  .days {
    display: grid;
    grid-template-columns: 14.3% 14.3% 14.3% 14.3% 14.3% 14.3% 14.3%;
    grid-auto-rows: minmax(16.6%, auto);
    padding-top: .16em;
    padding-bottom: 6.8%;
    height: 100%;

    .day {
      // margin-top: .6em;
      margin: 0px auto;
      width: 25px;
      height: 25px;
      padding-top: 5px;
    }

    .today {
      border-radius: 50%;
      margin: 0px auto;
      width: 25px;
      height: 25px;
      background-color: rgb(38 132 255);
      color: white;
    }
  }

  .days > div {
    text-align: center;
    // font-size: 0.9em;
    // font-weight: bold;
    font-size: .688rem;
    &.prev-day {
      font-size: .688rem;
      color: #cccccc;

      &.day0 {
        color: #ffcccc;
      }

      &.day6 {
        color: #93b3d1;
      }
    }
    &.next-day {
      font-size: 0.8em;
      color: #cccccc;
    }
    &.first-line {
      border-top: 1px solid #cccccc;
      border-right: 1px solid #cccccc;
      border-bottom: 1px solid #cccccc;
      &.last-cell {
        border-right: none;
      }
    }
    &.mid-line {
      border-right: 1px solid #cccccc;
      border-bottom: 1px solid #cccccc;
    }
  }

  .day0 {
    color: #ff0202;
    &.last-line {
      border-radius: 0px 0px 0px 8px;
    }
  }

  .day6 {
    color: #348bdc;
    &.last-line {
      border-radius: 0px 0px 8px 0px;
    }
  }

  .schedule-box {
    display: flex;
    width: 65%;
    height: 25px;
    justify-content: center;
    align-items: center;
    background-color: #c9c9c9;
    border-radius: 5px;
    color: white;
    font-size: .688rem;
    margin-left: 24px;

    &.today-schedule {
      background-color: #f58e6b;
    }
  }
}
</style>
