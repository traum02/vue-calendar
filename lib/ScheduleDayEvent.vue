<template>
  <!-- <div
    class="event-layout" @click.stop.prevent="onClickEvent"
  >
    <span class="event-color" />
    <span class="event-title">
      {{ title }}
    </span>
  </div> -->
  <div style="display: relative">
    <div style="float:left; height: 50px; background-color: aqua;">1</div>
    <div style="float:left; height: 150px; background-color: blanchedalmond;">2</div>
    <div style="float:left; clear: both;">3</div>
  </div>
</template>

<script lang="ts" setup>
import { computed, PropType, watch } from 'vue';
import { convertDatetoString } from './ScheduleDashBoardRest';
import { EVENT_COLORS, type scheduleData } from "./type/schedule";

const props = defineProps({
  events: Object as PropType<scheduleData[]>,
  date: String,
  time: String,
  cnt: Number,
})

watch(props,() =>{ 
  console.log(props);
})

const title = computed(() => {
  // console.log(props.event)
  // const desc = props.event?.title;
  // const schdtFrom = props.event?.schdtFrom;
  // const schdtTo = props.event?.schdtTo;
  // const timeFrom = props.event?.timeFrom??"";
  // const timeTo = props.event?.timeTo??"";
  // let strTitle = desc;
  // let strTime = "";
  // const isAllTime = timeFrom==""? true: false;
  
  // if (isAllTime) return desc;

  // if (convertDatetoString(schdtFrom as Date) == props.date 
  //   && convertDatetoString(schdtTo as Date) == props.date
  //   && !isAllTime
  // ) {
  //   strTime = timeFrom + "~" + timeTo + " ";
  // } else if (convertDatetoString(schdtFrom as Date) == props.date) {
  //   strTime = timeFrom + "~ ";
  // } else if (convertDatetoString(schdtTo as Date) == props.date) {
  //   strTime = "~" + timeTo + " ";
  // }
  // return strTime + strTitle;
})

const emit = defineEmits(['clickEvent']);

//css value
const defaultColor = EVENT_COLORS.brown;
const fontSize = "0.688rem";

function onClickEvent() {
  emit("clickEvent", props.date, props.events);
}

</script>

<style scoped lang="scss">

.event-layout {
  display: flex;
  align-items: center;
  overflow: hidden;
  font-size: v-bind('fontSize');
  margin-bottom: 4px;
  padding: 0rem 0.25rem;
  font-family: "Noto Sans KR";
  font-weight: none;
  cursor: pointer;

  .event-color {
    flex-shrink: 0;
    background-color: v-bind('props.events?.category??defaultColor');
    width: 6px;
    height: 6px;
    border-radius: 100%;
    margin-right: 0.2rem;
  }
  .event-title {
    flex-shrink: 0;
    color: #5f6368;
  }
}
</style>