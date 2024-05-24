<template>
  <div :class="[$style.capsuleBox, 'cwd-capsule']">
    <div :class="$style.capsule">
      <div v-for="item in list" :class="{ [$style.item]: true, [$style.active]: getProp(item, valueField) === currentValue }"
        :key="item.value" @click="handleItemClick(item)" vusion-slot-name="item">
        <slot name="item" :item="item"></slot>
        <s-empty v-if="(!$scopedSlots.item || !$scopedSlots.item({ item })) && $env && $env.VUE_APP_DESIGNER" />
      </div>
    </div>
  </div>
</template>

<script>
import { at } from 'lodash';
export default {
  name: "cwd-capsule",
  props: {
    dataSource: {
      type: [Array, Function],
      default: () =>  [{ label: "月销售统计", value: "month"},{ label: "年销售统计", value: "year"}],
    },
    textField: {
      type: String,
      default: 'label',
    },
    valueField: {
      type: String,
      default: 'value',
    },
    value: {
      type: [String, Number],
    },
  },
  data() {
    return {
      list: [],
      currentValue: this.value,
    };
  },
  watch: {
    value(val) {
      if (val === this.currentValue) {
        return;
      }

      this.currentValue = val;
    },
    dataSource: {
      handler() {
        this.$nextTick(() => {
          this.loadListForDataSource();
        })
      },
      immediate: true
    }
  },
  methods: {
    getProp(item, propName) {
      return at(item, propName)[0];
    },
    normalizeData(data) {
      if (Array.isArray(data)) {
        return data;
      }

      if (typeof data === 'object' && Array.isArray(data.list)) {
        return data.list;
      }

      return [];
    },
    async loadListForDataSource() {
      if (typeof this.dataSource === 'function') {
        const data = await this.dataSource({ value: this.currentValue, page: 1, size: 10 });
        this.list = this.normalizeData(data);
      } else {
        this.list = this.normalizeData(this.dataSource);
      }

      if (!this.currentValue && this.list.length > 0) {
        this.handleItemClick(this.list[0]);
      }
    },
    handleItemClick(item) {
      this.currentValue = this.getProp(item, this.valueField);
      this.$emit('change', {
        value: this.currentValue,
        item,
      });    //抛出事件
      this.$emit("update:value", this.currentValue);   //设置了IDE属性sync: true后添加
    }
  }
};
</script>

<style module>
.capsuleBox {
  overflow: hidden;
}

.capsule {
  display: flex;
  background-color: var(--cwd-capsule-background-color);
  border-radius: 15px;
  padding: 2px 3px;
  float: left;
}

.active {
  background-color: var(--cwd-capsule-background-color-active);
}

.item {
  border-radius: 15px;
  padding: 2px 14px;
  cursor: pointer;
  color: var(--cwd-capsule-color);
  transition: ease 200ms;
  font-size: var(--cwd-capsule-font-size);
  line-height: 1.5;
}

.item.active {
  color: var(--cwd-capsule-color-active);
}
</style>
