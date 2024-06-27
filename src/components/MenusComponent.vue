<template>
  <CDropdown>
    <CDropdownToggle color="primary">Artists</CDropdownToggle>
    <CDropdownMenu>
      <CDropdownItem v-for="(count, artist) in sortedArtists" :key="artist" @click="filterBy('artist', artist)">{{ artist }}: {{ count }}</CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
  <CDropdown>
    <CDropdownToggle color="primary">Venues</CDropdownToggle>
    <CDropdownMenu>
        <CDropdownItem v-for="(count, venue) in sortedVenues" :key="venue" @click="filterBy('venue', venue)">{{ venue }}: {{ count }}</CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
  <CDropdown>
    <CDropdownToggle color="primary">Years</CDropdownToggle>
    <CDropdownMenu>
        <CDropdownItem v-for="(count, year) in sortedYears" :key="year" @click="filterBy('date', year)">{{ year }}: {{ count }}</CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
  <CDropdown>
    <CDropdownToggle color="primary">Gig Types</CDropdownToggle>
    <CDropdownMenu>
        <CDropdownItem v-for="(count, gigtype) in sortedTypes" :key="gigtype" @click="filterBy('gigtype', gigtype)">{{ gigtype }}: {{ count }}</CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
  <CDropdown>
    <CDropdownToggle color="primary">Sort Lists</CDropdownToggle>
    <CDropdownMenu>
        <CDropdownItem @click="setSort('asc')">A to Z</CDropdownItem>
        <CDropdownItem  @click="setSort('desc')">Z to A</CDropdownItem>
        <CDropdownItem  @click="setSort('freq')">Frequency desc.</CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
  <div class="titletext">
    The Ticket Thing (powered by <a href="https://www.jasonbstanding.com">jasonbstanding.com</a>) | <router-link to="/stats">Stats</router-link>
  </div>
</template>
  
<script>
import { CDropdown, CDropdownToggle, CDropdownItem, CDropdownMenu } from '@coreui/vue';

export default {
    name: 'MenusComponent',
    components: {
        CDropdown,
        CDropdownItem,
        CDropdownToggle,
        CDropdownMenu,
    },
    props: {
        artists: Object,
        venues: Object,
        years: Object,
        types: Object
    },
    data() {
        return {
            sortName: "freq"
        }
    },
    computed: {
      sortedArtists() {
        return this.sortData(this.artists, this.sortName);
      },
      sortedVenues() {
        return this.sortData(this.venues, this.sortName);
      },
      sortedYears() {
        return this.sortData(this.years, this.sortName);
      },
      sortedTypes() {
        return this.sortData(this.types, this.sortName);
      },
    },
    methods: {
      filterBy(type, value) {
        this.$emit('filter', { type, value });
      },
      setSort(sortName) {
        if (sortName == "asc" || sortName == "desc") {
            this.sortName = sortName;
        } else {
            this.sortName = "freq";
        }
      },
      sort2d(arrayName) {
        // Convert the object to an array of [name, count] pairs
        const entries = Object.entries(arrayName);

        // Sort the entries first by count in descending order, then by name in ascending order
        entries.sort(([nameA, countA], [nameB, countB]) => {
            if (countA === countB) {
            return nameA.localeCompare(nameB);
            }
            return countB - countA; // Sort by count in descending order
        });

        return Object.fromEntries(entries);
      },
      asort(arrayName, dir) {
        // Convert the object to an array of [name, count] pairs
        const entries = Object.entries(arrayName);

        // Sort the entries first by count in descending order, then by name in ascending order
        entries.sort(([nameA], [nameB]) => {
            return nameA.localeCompare(nameB);
        });
        if (dir == "desc") {
            entries.sort().reverse();
        }
        return Object.fromEntries(entries);
      },
      sortData(data, sortName) {
        if (sortName == "asc" || sortName == "desc") {
          return this.asort(data, sortName);
        } else {
          return this.sort2d(data);
        }
      },
    }
};
</script>

<style scoped>
.titletext a {
    text-decoration:none;
    color:orange;
}
.titletext a:hover {
    text-decoration:underline;
}
</style>
