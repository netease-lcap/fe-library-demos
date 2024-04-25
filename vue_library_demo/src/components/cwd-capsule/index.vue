<template>
  <div :class="$style.capsuleBox">
    <div :class="$style.capsule">
      <div v-for="item in data" :class="{ [$style.item]: true, [$style.active]: selectedItem && selectedItem.value === item.value }"
        :key="item.value" @click="handleItemClick(item)">
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "cwd-capsule",
  props: {
    data: {
      type: Array,
      default: () => [
        { label: "月销售统计", value: "month" },
        { label: "年销售统计", value: "year" }
      ]
    },
    value: String
  },
  data() {
    return {
      selectedItem: null
    };
  },
  watch: {
    data: {
      handler() {
        this.selectedItem = this.data.find(item => item.value === this.value) || this.data[0];
      },
      immediate: true
    }
  },
  methods: {
    handleItemClick(item) {
      this.selectedItem = item;
      this.$emit('change', item.value);    //抛出事件
      this.$emit("update:value", item.value);   //设置了IDE属性sync: true后添加
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
  background-color: rgb(236, 236, 236);
  border-radius: 15px;
  padding: 2px 3px;
  float: left;
}

.active {
  background-color: white;
}

.item {
  border-radius: 15px;
  padding: 2px 14px;
  cursor: pointer;
}
</style>
