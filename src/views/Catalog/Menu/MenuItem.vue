<template>
    <div class="menu-item">
  <li>
    <div>
      <TextBox v-model="item.name"/>
      <div class="flex-row">
        <Button @click="addChild" class="me-3" label="+ Child" style="width:fit-content !important; padding: 4px 8px;"></Button>
        <Button @click="$emit('delete')" buttonType="danger" label="delete" style="width:fit-content !important; padding: 4px 8px;"></Button>
        </div>
    </div>

    <!-- Render children recursively -->
    <ul v-if="item.children && item.children.length">
      <MenuItem
        v-for="(child, index) in item.children"
        :key="index"
        :item="child"
         @delete="deleteChild(index)"
      />
    </ul>
  </li>
  </div>
</template>

<script>
export default {
  name: 'MenuItem',
  props: ['item'],
  methods: {
    addChild() {
      this.item.children.push({
        name: 'New Menu',
        children: []
      });
    },
    deleteChild(index) {
      this.item.children.splice(index, 1);
    }
  },
  components: {
    // register self
    MenuItem: () => import('./MenuItem.vue')
  }
};
</script>

<style>
.menu-item li.level-0 > div {
  background-color: #f8f9fa !important;
}
.menu-item li.level-1 > div {
  background-color: #e0f7fa !important;
}
.menu-item li.level-2 > div {
  background-color: #ffe0b2 !important;
}
.menu-item li.level-3 > div {
  background-color: #f3e5f5 !important;
}
.menu-item ul {
  list-style-type: none;
  padding-left: 20px;
  margin: 0;
}

.menu-item li {
  list-style-type: none; 
  margin: 8px 0;
  position: relative;
}

.menu-item li > div {
  background-color: #f8f9fa;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s ease;
}

.menu-item li > div:hover {
  background-color: #e9ecef;
}

</style>
