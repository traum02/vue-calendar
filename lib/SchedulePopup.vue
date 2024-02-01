<template>
  <div
    class="event-flyout"
    :class="{ 'is-visible': props.config?.isVisible??false }"
  >
    <div class="event-flyout__menu">
      <span class="event-flyout__menu-editable">
        <span class="event-color" />{{ props.currentDate??"" }}
      </span>
      <span class="event-flyout__menu-close">
        <font-awesome-icon
          v-if="!readonly"
          class="event-flyout__menu-item is-edit-icon"
          title="저장"
          :icon="icons.save"
          @click="editFlyout"
        />
        <font-awesome-icon
          v-if="isEditable && props.config?.isUpdate"
          class="event-flyout__menu-item is-edit-icon"
          :title="readonly?`수정`:`취소`"
          :icon="readonly?icons.edit:icons.cancel"
          @click="toggleEdit"
        />
        <font-awesome-icon
          v-if="isEditable && props.config?.isUpdate"
          class="event-flyout__menu-item is-edit-icon"
          title="삭제"
          :icon="icons.trash"
          @click="deleteEvent"
        />
        <font-awesome-icon
          class="event-flyout__menu-item is-times-icon"
          title="닫기"
          :icon="icons.times"
          @click="closeFlyout"
        />
      </span>
    </div>
    <div class="event-flyout__row">
      <font-awesome-icon
          :icon="icons.title"
          class="calendar-week__event-icon"
        />
      <span>일정 :</span> 
      <span v-if="readonly">{{ props.event?.title }}</span>
      <span v-else-if="!readonly"><input v-model="data.title"></span>
    </div>
    <div class="event-flyout__row">
      <font-awesome-icon
          :icon="icons.clock"
          class="calendar-week__event-icon"
        />
      <span>시간 :</span>
      <span v-if="readonly">{{props.event?.schdtFrom}} {{ props.event?.timeFrom }} ~ {{props.event?.schdtTo}} {{ props.event?.timeTo }}</span>
      <span v-else-if="!readonly">
        종일: <input type="checkbox" v-model="dateType.value"><br>
        <span>
          <input type="date" v-model="data.date.startdt">
          <input v-if="!dateType.value" type="time" v-model="data.date.starttime">
          ~
          <input type="date" v-model="data.date.enddt">
          <input v-if="!dateType.value" type="time" v-model="data.date.endtime">
      </span>
      </span>
    </div>
    <div class="event-flyout__row">
      <font-awesome-icon
          :icon="icons.description"
          class="calendar-week__event-icon"
        />
      <span>내용 : </span>
      <span v-if="readonly">{{ props.event?.contents }}</span>
      <span v-else-if="!readonly"><input v-model="data.contents"></span>
    </div>
    <div class="event-flyout__row">
      <font-awesome-icon
          :icon="icons.location"
          class="calendar-week__event-icon"
        />
      <span>장소 : </span>
      <span v-if="readonly">{{ props.event?.place }}</span>
      <span v-else-if="!readonly"><input v-model="data.place"></span>
    </div>
    <div class="event-flyout__row">
      <font-awesome-icon
          :icon="icons.refUsers"
          class="calendar-week__event-icon"
        />
      <span>참조 : </span>
      <span v-if="readonly">{{ props.event?.refUser }}</span>
      <span v-else-if="!readonly"><input v-model="data.refUser"></span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, PropType, watch} from 'vue';
import { faMapMarkerAlt, faTimes} from '@fortawesome/free-solid-svg-icons';
import {
  faClock,
  faComment,
  faEdit,
  faQuestionCircle,
  faTrashAlt,
  faUser,
  faRectangleXmark,
  faSquareCheck,
  faAddressCard,
faMessage,
} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import { EVENT_COLORS, type popupConfig, type scheduleData } from './ScheduleDashBoardRest';

  const props = defineProps({
    event: Object as PropType<scheduleData>,
    config: Object as PropType<popupConfig>,
    currentDate: String,
  })

  const dateType = ref({type: "date" as string, value: true as boolean});
  const isEditable = ref(props.config?.isEditable);
  const readonly = ref(props.config?.readonly);
  const defaultColor = EVENT_COLORS.brown;
  const icons = ref({
          clock: faClock,
          user: faUser,
          title: faComment,
          description: faMessage,
          trash: faTrashAlt,
          edit: faEdit,
          times: faTimes,
          topic: faQuestionCircle,
          location: faMapMarkerAlt,
          cancel: faRectangleXmark,
          save: faSquareCheck,
          refUsers: faAddressCard,
        });

  const data = computed(()=>  {
    return {
        title: props.event?.title?? "",
        date: {
          startdt: props.event?.schdtFrom?? props.currentDate, enddt: props.event?.schdtTo?? props.currentDate,
          starttime: props.event?.timeFrom??"", endtime: props.event?.timeTo??""
        },
        place: props.event?.place?? "",
        contents: props.event?.contents?? "",
        refUser: props.event?.refUser?? "",
        seq: props.event?.seq?? null,
      }
  });

  const emit = defineEmits(['close-event', 'save-event', 'edit-event', 'delete-event']);

  watch(props, () =>{
    if(props.config) {
      isEditable.value = props.config.isEditable;
      readonly.value = props.config.readonly;
    }
    if(Object.keys(props.event as scheduleData).length !== 0 && props.event?.timeFrom && props.event?.timeTo) {
      dateType.value.value = false;
    } else {
      dateType.value.value = true;
    }
  })

  // 닫기
  function closeFlyout() {
    emit('close-event');
    init();
  }

  // 수정여부 전환 토글
  function toggleEdit() {
    readonly.value = !readonly.value;
  }

  // 저장 및 수정
  function editFlyout() {
    console.log(props.event?.seq);
    readonly.value = false;
    emit('edit-event', {...data.value, seq: props.event?.seq, crtUsrId: props.event?.crtUsrId, crtDt: props.event?.crtDt});
  }

  // 삭제
  function deleteEvent(e: scheduleData) {
    if(!data.value.seq) {
      alert("seq 오류")
    }
    readonly.value = false;
    emit('delete-event', data.value.seq as number);
  }

  function init() {
    readonly.value = true;
  }

</script>

<style scoped lang="scss">

.event-flyout {
  position: absolute;
  z-index: 500;
  background-color: #fff;
  max-height: 100%;
  // width: v-bind(flyoutWidth);
  width: 400px;
  max-width: 98%;
  border: var(--qalendar-border-gray-thin);
  border-radius: 8px;
  box-shadow: 0 12px 24px rgb(0 0 0 / 9%), 0 6px 12px rgb(0 0 0 / 18%);
  overflow: hidden;
  transition: all 0.2s ease;
  transition-property: opacity, transform;
  transform: translateY(-50%) translateX(-50%);
  opacity: 0;
  pointer-events: none;
  top: 50%;
  left: 50%;

  &.is-visible {
    opacity: 1;
    // transform: translateY(0);
    pointer-events: initial;
  }

  .event-header {
    padding: 5px 5px 0px 5px;
  }

  &__relative-wrapper {
    position: relative;
  }

  &__menu {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .event-flyout__menu-editable,
    .event-flyout__menu-close {
      padding: 10px 10px 10px .5rem;
      display: flex;
    }
    
    .event-flyout__menu-close {
      grid-gap: 20px;
      position: absolute;
      top: 0;
      right: 0;
    }
    .event-color {
      flex-shrink: 0;
      background-color: v-bind('props.event?.category??defaultColor');
      width: 6px;
      margin-right: 0.2rem;
    }
  }

  &__menu-item {
    font-size: var(--qalendar-font-l);
    color: gray;

    &:hover {
      color: var(--qalendar-theme-color);
      cursor: pointer;
    }
  }

  .is-trash-icon {
    &:hover {
      color: red;
    }
  }

  &__info-wrapper {
    padding: 10px;
  }

  &__row {
    grid-gap: 10px;
    //margin-bottom: 0.25em;
    margin: 0.5em;
    margin-top: 0em;
    font-weight: 400;

    p {
      margin: 0;
      padding: 0;
    }

    span {
      margin-right: 5px;
    }

    svg {
      margin-top: 0.1rem;
      margin-right: 0.1rem;
      color: #5f6368;
      width: 14px;
    }

    input {
      height: 20px;
      font-size: 10pt;
    }
  }

  &__color-icon {
    --icon-height: 16px;

    border-radius: 50%;
    height: var(--icon-height);
    width: var(--icon-height);
  }

  .is-title {
    font-size: var(--qalendar-font-l);
    align-items: center;

    .is-not-editable & {
      max-width: 90%;
    }
  }

  .is-time {
    font-size: var(--qalendar-font-s);
    margin-bottom: 0.75em;
  }
}
</style>