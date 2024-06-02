<template>
  <CDropdown>
    <CDropdownToggle color="primary">Artists</CDropdownToggle>
    <CDropdownMenu class="scrollable-dropdown">
      <CDropdownItem v-for="(count, artist) in artists" :key="artist" @click="filterBy('artist', artist)">{{ artist }}: {{ count }}</CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
  <CDropdown>
    <CDropdownToggle color="primary">Venues</CDropdownToggle>
    <CDropdownMenu>
        <CDropdownItem v-for="(count, venue) in venues" :key="venue" @click="filterBy('venue', venue)">{{ venue }}: {{ count }}</CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
  <CDropdown>
    <CDropdownToggle color="primary">Years</CDropdownToggle>
    <CDropdownMenu>
        <CDropdownItem v-for="(count, year) in years" :key="year" @click="filterBy('date', year)">{{ year }}: {{ count }}</CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
  <CDropdown>
    <CDropdownToggle color="primary">Sort Lists</CDropdownToggle>
    <CDropdownMenu>
        <CDropdownItem href="#">A to Z</CDropdownItem>
        <CDropdownItem href="#">Z to A</CDropdownItem>
        <CDropdownItem href="#">Frequency desc.</CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>
  
<script>
import { CDropdown, CDropdownToggle, CDropdownItem, CDropdownMenu } from '@coreui/vue';

export default {
    name: 'MenusComponent',
    components: {
        CDropdown,
        CDropdownItem,
        CDropdownToggle,
        CDropdownMenu
    },
    props: {
        artists: Object,
        venues: Object,
        years: Object
    },
    methods: {
      filterBy(type, value) {
        this.$emit('filter', { type, value });
      }
    }
};
</script>

<style scoped>
.scrollable-dropdown {
  max-height: 200px; /* Adjust the height as needed */
  overflow-y: auto;
}
</style>
