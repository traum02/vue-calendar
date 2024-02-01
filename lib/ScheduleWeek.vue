<template>
  <section style="height: 100%; position: relative;;">
    <div style="padding-left: 10%; padding-right: 15px; height: 5em;">
      <div class="weekdays">
        <div v-for="(day, idx) in days" :key="idx" :class="'day' + idx">
          {{ day }}
        </div>
      </div>
      <div class="weekdate">
        <div v-for="(date, idx) in objDates" :key="idx" :class="'day' + idx">
          {{ date.day }}
        </div>
      </div>
      <div class="weekdate">
        <div class="" v-for="(date, idx) in objDates">
          {{ date.day }}
        </div>
      </div>
    </div>
    <div class="font-css" style="overflow: auto; position: relative; height: calc(100% - 11em); padding-left: 10%;">
      <div style="display: flex; width: 100%; height: 240em;">
        <div
          v-for="(date, idx) in objDates"
          :key="idx"
          style="width: 16%; border-left: 1px solid #ccc; z-index: 500;"
        >
        <Event :event="date.event"/>
          <!-- <div v-for="d in date.event">
            <span
              v-for="d in date.event"
              style="position: absolute;"
              :style="{ top: parseFloat(d.timeFrom.substring(0, 2))*10+'em'}"
            >
              {{ d.title }}<br>
            </span>
          </div> -->
        </div>
      </div>
      <div style="position: absolute; height: 100%; width: 100%; left: 0px; top: 0px; background: none;">
        <div v-for="i in 24" style="border-top: 1px solid #ccc; height: 10em;">{{ (i-1).toString().padStart(2, "0") }}시</div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { PropType, computed, onMounted, ref, watch } from 'vue';
import Event from './ScheduleDayEvent.vue';
import { convertDatetoString, diffMonth } from "./ScheduleDashBoardRest";
import { type scheduleData, type popupConfig, type restData, type dateSet } from "./type/schedule";

const days = ["월", "화", "수", "목", "금", "토", "일"];
const currentYear = ref(0 as number);
const currentMonth= ref(0 as number);
const year = ref(0 as number);
const month = ref(0 as number);
const today = ref(0 as number);
const selectedDay = ref(0 as number);
const selectedEvent = ref({} as scheduleData);
const config = ref({
  isVisible: false,
  isEditable: true,    // 수정 권한 여부
  readonly: true,      // 수정 여부
  title: "",          // 휴일 이름
  isUpdate: false,
} as popupConfig);
const eventDate = ref("" as string);
const objDates= ref([] as dateSet[]);
const selectedMonth = ref("" as string);
const event = ref([]);
const selectBoxOption = ref([
    {label: '월', value: 'month'},
    {label: '주', value: 'week'},
    {label: '일', value: 'day'}
  ]
);
const calenderType = ref();
const props = defineProps({
  events: Object as PropType<scheduleData[]>,
  year: Number,
  month: Number,
  selectedWeek: String,
  objDates: Object as PropType<dateSet[]>,
});
const emit = defineEmits(['click-day', 'click-event', 'edit-event', 'save-event', 'delete-event', 'update-day']);

onMounted(async () => {
  getToday();
})

watch(props, ()=>{
  console.log(props)
  // month.value = props.month as number;
  
  year.value = parseInt(props.selectedWeek!.split("-")[0]);
  const week = parseInt(props.selectedWeek!.split("W")[1]);
  const d = new Date(year.value, 0, 1);
  const w = d.getTime() + 604800000 * (week - 1);
  const date1 = new Date(w);
  const date2 = new Date(w + 518400000);
  // setWeekOfYear(date2);
  // console.log(date1, selectedWeek.value);
  const param = {start: date1, end: date2};
  objDates.value = getWeekOfDays(date1, date2);
  // objDates.value = props.objDates as dateSet[];
  if(props.events!.length > 0)
    setEvents(objDates.value);

});

// function
function calWeekOfYear() {
  let c = new Date();
  let s = new Date(c.getFullYear(), 0, 1);
  let days = Math.floor(((c as any) - (s as any)) /
    (24 * 60 * 60 * 1000));
 
  let weekNumber = Math.ceil(days / 7);

  // Display the calculated result       
  console.log("Week number of " + c +
    " is :   " + weekNumber);

}


function onClickEvent(date:string, e: scheduleData) {
  emit('click-event', date, e);
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

function returnStrDate(year: number, month: number, day: number) {
  return [year.toString(), month.toString().padStart(2, '0'), day.toString().padStart(2, '0')].join('-');
}

function getToday() {
  const date = new Date();
  currentYear.value = date.getFullYear(); // 이하 현재 년, 월 가지고 오기
  currentMonth.value = date.getMonth() + 1;
  // year.value = currentYear.value;
  month.value = currentMonth.value;
  today.value = date.getDate(); // 오늘 날짜
  const year = parseInt(props.selectedWeek!.split("-")[0]);
  const week = parseInt(props.selectedWeek!.split("W")[1]);
  selectedDay.value = date.getDate();
  selectedMonth.value = [year, month.value.toString().padStart(2, "0")].join("-");
  // objDates.value= getWeekOfDays(year.value, month.value);

  const d = new Date(year, 0, 1);
  const w = d.getTime() + 604800000 * (week - 1);
  const date1 = new Date(w);
  const date2 = new Date(w + 518400000);
  // setWeekOfYear(date2);
  // console.log(date1, selectedWeek.value);
  const param = {start: date1, end: date2};
  objDates.value = getWeekOfDays(date1, date2);

  console.log(param, objDates.value)

  emit("update-day", getDate(year, month.value-1));
}

function getDate(year: number, month: number) {
  const date = new Date(year, month, 1);
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth()+1, 0);
  const date1 = new Date(date.getFullYear(), date.getMonth(), 1-firstDay.getDay());
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
  console.log("clickDay", value);
  if (value.month != month.value) {
    calenderData(value.month - month.value);
    return;
  }
  // selectedEvent.value = {} as scheduleData;
  // eventDate.value = [value.year, value.month.toString().padStart(2, "0"), value.day.toString().padStart(2, "0")].join("-");
  // selectedDay.value = value.day;
  // year.value = value.year;

  // config.value.isVisible = !config.value.isVisible;
  // config.value.readonly = false;
  // config.value.isUpdate = false;

  emit("click-day", value);
};

// 월 이동
function calenderData(arg: number) {
  closeEvent();
  const current = new Date(year.value, month.value - 1);
  current.setMonth(current.getMonth() + arg);

  year.value = current.getFullYear();
  month.value = current.getMonth() + 1;
  selectedMonth.value = [year.value, month.value.toString().padStart(2, "0")].join("-");
  objDates.value= getMonthOfDays(year.value, month.value);
  emit("update-day", getDate(year.value, month.value-1));
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

const setEventStyle = computed((v: scheduleData) => {
  console.log("setEventStyle", v);
  let strStyle = "";
  strStyle += "height: "+ (parseFloat(v.timeFrom.replace(":", ".")) *50);
  console.log("setEventStyle", v, strStyle);
  return strStyle;
});

// 일정 설정
function setEvents(dates: dateSet[]) {
  if(props.events?.length===0) {
    return dates;
  }

  console.log(props.events);

  dates.forEach((e: dateSet, index: number) => {
    // console.log(time);
    let t = props.events?.filter((item) =>
      new Date(convertDatetoString(item.schdtFrom)  + " 00:00") <= new Date(year.value, e.month-1, e.day)
      && new Date(convertDatetoString(item.schdtTo) + " 00:00") >= new Date(year.value, e.month-1, e.day)
    );
    console.log(t,year.value, e.month-1, e.day )
    dates[index] = ({...e, event:t});
  });
  console.log(dates)
  objDates.value = dates;
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

    .fontsize {
      font-size: 1.5em;
      font-weight: bold;
    }
  }

  .weekdays {
    display: flex;
    div {
      width: 16%;
      font-size: 1.1em;
      font-weight: bold;
      text-align: center;
    }
  }

  .weekdate {
    display: flex;
    div {
      width: 16%;
      text-align: center;
      color: #2f2f2f;
      font-size: 15px;
    }
  }

  .font-css {
    align-items: center;
    overflow: hidden;
    font-size: 0.688em;
    margin-bottom: 4px;
    padding: 0rem 0.25rem;
    font-family: "Noto Sans KR";
    font-weight: none;
  }

  .days {
    // display: grid;
    // grid-template-columns: 12.5% 12.5% 12.5% 12.5% 12.5% 12.5% 12.5% 12.5%;
    // grid-auto-rows: minmax(16.6%, auto);
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

    .day-time {
    border-radius: 0px 0px 0px 8px;
    display: grid;
    // grid-auto-rows: minmax(4%, auto);
    > div {
      // align-self: center;
      border-top: 1px solid #cccccc;
      // padding: 10px;
    }
    // padding-top: 50px;
  }
  }

  .days {
    > div {
      font-size: .688rem;
      border-top: 1px solid #cccccc;
      border-bottom: 1px solid #cccccc;
    }
    > div:first-child {
      border-radius: 0px 0px 0px 8px;
    }
    > div:not(:last-child) {
      text-align: center;
      // font-size: 0.9em;
      // font-weight: bold;
      font-size: .688rem;
      border-top: 1px solid #cccccc;
      border-right: 1px solid #cccccc;
      border-bottom: 1px solid #cccccc;
    }
  }

  
  .day6 {
    color: #ff0202;
    &.last-line {
      border-radius: 0px 0px 8px 0px;
    }
  }

  .day5 {
    color: #348bdc;
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
