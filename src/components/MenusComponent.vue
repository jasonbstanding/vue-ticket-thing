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
        <CDropdownItem v-for="(count, type) in sortedTypes" :key="type" @click="filterBy('type', type)">{{ type }}: {{ count }}</CDropdownItem>
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
    The Ticket Thing (powered by <a href="https://www.jasonbstanding.com">jasonbstanding.com</a>) 
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
        let artists = {};
        if (this.sortName == "asc" || this.sortName == "desc") {
            artists = this.asort(this.artists, this.sortName);
        } else {
            artists = this.sort2d(this.artists);
        }
        return artists;
      },
      sortedVenues() {
        let venues = {};
        if (this.sortName == "asc" || this.sortName == "desc") {
            venues = this.asort(this.venues, this.sortName);
        } else {
            venues = this.sort2d(this.venues);
        }
        return venues;
      },
      sortedYears() {
        let years = {};
        if (this.sortName == "asc" || this.sortName == "desc") {
            years = this.asort(this.years, this.sortName);
        } else {
            years = this.sort2d(this.years);
        }
        return years;
      },
      sortedTypes() {
        let types = {};
        if (this.sortName == "asc" || this.sortName == "desc") {
            types = this.asort(this.types, this.sortName);
        } else {
            types = this.sort2d(this.types);
        }
        return types;
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
