<template>
  <v-card elevation="2" rounded="lg" class="mb-6" min-height="480px">
    <v-card-title class="d-flex align-start justify-space-between py-4">
      <div class="title-block">
        <div class="d-flex align-center">
          <v-icon icon="mdi-flask-outline" class="me-2" color="primary" />
          <span class="text-subtitle-1 font-weight-bold">
            {{ panelTitle }}
          </span>
        </div>
        <div v-if="subtitle" class="text-caption text-medium-emphasis mt-1">
          {{ subtitle }}
        </div>
      </div>
      <v-btn
        variant="text"
        size="small"
        color="primary"
        aria-label="View all studies"
        @click="viewAllStudies"
      >
        View All
      </v-btn>
    </v-card-title>

    <v-card-text class="pa-4">
      <v-row v-if="loading">
        <v-col v-for="n in 4" :key="n" cols="12" md="6">
          <v-skeleton-loader
            type="card"
            class="study-card"
            elevation="2"
            rounded="lg"
          />
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col v-if="!filteredStudies.length" cols="12">
          <v-alert
            type="info"
            variant="tonal"
            rounded="lg"
            border="start"
          >
            {{ emptyMessage }}
          </v-alert>
        </v-col>
        <template v-else>
          <v-col v-for="study in filteredStudies.filter(s => s)" :key="study.id" cols="12" md="6">
          <v-card variant="outlined" rounded="lg" class="study-card" hover @click="goToStudy(study)">
            <v-card-text class="pa-4">
              <div class="d-flex align-center justify-space-between mb-3">
                <v-chip
                  :color="study.status === 'active' ? 'success' : study.status === 'finished' ? 'warning' : 'info'"
                  variant="tonal" size="small">
                  {{ study.status ? (study.status.charAt(0).toUpperCase() + study.status.slice(1)) : 'Unknown' }}
                </v-chip>
                <v-icon :icon="getMethodIcon(study)" size="20" color="primary" />
              </div>

              <h4 class="text-subtitle-1 font-weight-bold mb-2">
                {{ study.title }}
              </h4>
              <div class="description-wrapper">
                <p 
                  class="text-body-2 text-medium-emphasis mb-3"
                  :class="{ 'description-truncated': !expandedStudies[study.id] && study.isLongDescription }"
                >
                  {{ study.description }}
                </p>
                <v-btn
                  v-if="study.isLongDescription"
                  @click.stop="toggleExpand(study.id)"
                  variant="text"
                  size="small"
                  color="primary"
                  class="text-lowercase"
                  :prepend-icon="expandedStudies[study.id] ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                >
                  {{ expandedStudies[study.id] ? 'Show less' : 'Show more' }}
                </v-btn>
              </div>

              <!-- Progress -->
              <div v-if="study.progress !== null" class="mb-3">
                <div class="d-flex justify-space-between align-center mb-1">
                  <span class="text-caption font-weight-medium">Progress</span>
                  <span class="text-caption">{{ study.progress }}%</span>
                </div>
                <v-progress-linear
                  :model-value="study.progress"
                  :color="study.status === 'active' ? 'success' : 'primary'"
                  height="6"
                  rounded
                />
              </div>

              <!-- Metrics -->
              <div class="d-flex justify-space-between text-caption">
                <div class="d-flex align-center">
                  <v-icon icon="mdi-account-group" size="16" class="me-1" color="info" />
                  <span>{{ study.participants }} participants</span>
                </div>
                <div v-if="study.daysLeft !== null" class="d-flex align-center">
                  <v-icon icon="mdi-calendar-clock" size="16" class="me-1" color="warning" />
                  <span v-if="study.daysLeft >= 0">{{ `${study.daysLeft} ${study.daysLeft > 1 ? 'days left' : 'day left'}` }}</span>
                  <span v-else class="text-error">{{ `${Math.abs(study.daysLeft)} days overdue` }}</span>
                </div>
              </div>

              <v-divider class="my-3" />

              <div class="d-flex justify-end">
                <v-btn
                  variant="tonal"
                  color="primary"
                  size="small"
                  @click.stop="handlePrimaryAction(study)"
                  :aria-label="getPrimaryActionLabel(study)"
                >
                  {{ getPrimaryActionLabel(study) }}
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        </template>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import AnswerController from '@/shared/controllers/AnswerController';
import { getMethodIcon, getMethodManagerView, STUDY_TYPES } from '@/shared/constants/methodDefinitions';
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const props = defineProps({
  studies: {
    type: Array,
    default: () => []
  },
  mode: {
    type: String,
    default: 'my',
  },
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  viewAllTarget: {
    type: [String, Object],
    default: 'studies',
  },
  searchQuery: {
    type: String,
    default: '',
  },
  statusFilter: {
    type: String,
    default: 'all',
  },
  emptyMessage: {
    type: String,
    default: 'No studies available in this view yet.',
  },
})

const router = useRouter();
const store = useStore();
const answerController = new AnswerController()

const loading = ref(false);
const studiesWithAnswers = ref([]);
const expandedStudies = ref({});

const panelTitle = computed(() => {
  if (props.title) return props.title;
  return props.mode === 'community' ? 'Community Studies Overview' : 'My Studies Overview';
});

const getPrimaryActionLabel = (study) => {
  if (props.mode === 'community') return 'View';
  if (study?.progress === 100) return 'View';
  return 'Continue';
};

const isLongDescription = (description) => {
  return description && description.length > 250;
};

const studies = computed(() => {
  if (loading.value) return [];
  return props.studies.length > 0 ? studiesWithAnswers.value : [];
})

/**
 * Normalizes text for case-insensitive filtering.
 * @param {string} value
 * @returns {string}
 */
const normalizeText = (value) => (typeof value === 'string' ? value.toLowerCase() : '');

const filteredStudies = computed(() => {
  const query = normalizeText(props.searchQuery);
  const status = props.statusFilter;

  return studies.value.filter((study) => {
    if (!study) return false;
    const title = normalizeText(study.title || '');
    const description = normalizeText(study.description || '');
    const matchesQuery = !query || title.includes(query) || description.includes(query);
    const studyStatus = study.status || 'unknown';
    const matchesStatus = status === 'all' || studyStatus === status;
    return matchesQuery && matchesStatus;
  });
});

const lastFourStudies = computed(() => {
  if (!props.studies) return [];
  return [...props.studies].sort(
    (a, b) => (b.creationDate || 0) - (a.creationDate || 0)
  ).slice(0, 4);
});

async function loadAnswers() {
  if (!lastFourStudies.value.length) {
    studiesWithAnswers.value = [];
    return;
  }

  loading.value = true;
  const last4 = []
  try {
    if (props.mode === 'community') {
      finalFour(lastFourStudies.value.map((study) => ({
        ...study,
        answers: [],
        progress: null,
      })))
      return;
    }

    for (const testDoc of lastFourStudies.value) {
      if (!testDoc?.answersDocId) {
        continue;
      }
      const answerDoc = await answerController.getAnswerById(testDoc.answersDocId);
      if (!answerDoc) {
        continue;
      }
      if (answerDoc.type === STUDY_TYPES.USER) {
        last4.push({
          ...testDoc,
          answers: Object.values({ ...answerDoc.taskAnswers })
        })
      } else {
        last4.push({
          ...testDoc,
          answers: Object.values({ ...answerDoc.heuristicAnswers })
        })
      }
    }
    finalFour(last4)
  } catch (e) {
    console.error('Error loading answers', e);
    studiesWithAnswers.value = [];
  } finally {
    loading.value = false;
  }
}

/**
 * Calculates the average progress across answer entries.
 * @param {Array} answers
 * @returns {number}
 */
const calculateProgress = (answers) => {
  if (!answers || answers.length === 0) return 0;
  const sum = answers.reduce((acc, val) => {
    const progress = typeof val?.progress === 'number' ? val.progress : 0;
    return acc + progress;
  }, 0);
  return sum / answers.length;
}

const daysLeft = (date) => {
  if(!date) return 0
  const futureDate = new Date(date);
  const today = new Date();

  const differenceInTime = futureDate.getTime() - today.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);

  return Math.floor(differenceInDays);
}

const finalFour = (studyArr) => {
  if (!studyArr) {
    studiesWithAnswers.value = [];
    return
  }
  studiesWithAnswers.value = studyArr.map(study => ({
    id: study.testDocId || study.id,
    title: study.testTitle || study.title,
    description: study.testDescription || study.description,
    isLongDescription: isLongDescription(study.testDescription || study.description),
    status: study.status,
    progress: study.progress === null ? null : calculateProgress(study.answers),
    participants: study.answers?.length || study.cooperators?.length || 0,
    daysLeft: study.endDate ? daysLeft(study.endDate) : null,
    typeIcon: 'mdi-sort-variant',
    testType: study.testType,
    subType: study.subType,
    testAdmin: study.testAdmin,
    cooperators: study.cooperators,
  }))
  .filter((study, index, self) =>
    index === self.findIndex(m => m.id === study.id)
  );
}

const canManageStudy = (study) => {
  const accessLevelGetter = store.getters.getUserAccessLevel;
  if (typeof accessLevelGetter !== 'function') return false;
  return accessLevelGetter(study) === 0;
};

const navigateToPublicStudy = (study) => {
  if (!study) return;
  const studyId = study.id;

  if (study.testType === STUDY_TYPES.CARD_SORTING) {
    router.push({ name: 'CardSortingTestView', params: { id: studyId } });
    return;
  }

  if (study.testType === STUDY_TYPES.ACCESSIBILITY_MANUAL) {
    router.push({ name: 'AccessibilityPreviewTest', params: { id: studyId } });
    return;
  }

  if (study.testType === STUDY_TYPES.ACCESSIBILITY_AUTOMATIC) {
    router.push({ name: 'AccessibilityReport', params: { id: studyId } });
    return;
  }

  router.push({ name: 'TestView', params: { id: studyId } });
};

const goToStudy = async (study) => {
  if (canManageStudy(study)) {
    const methodView = getMethodManagerView(study.testType, study.subType)
    router.push({ name: methodView, params: { id: study.id } })
    return;
  }

  navigateToPublicStudy(study);
}

const viewAllStudies = () => {
  // Dispatch custom event to change section
  globalThis.dispatchEvent(new CustomEvent('change-section', { detail: props.viewAllTarget }))
}

const toggleExpand = (studyId) => {
  expandedStudies.value[studyId] = !expandedStudies.value[studyId];
}

const handlePrimaryAction = (study) => {
  goToStudy(study);
};

watch(
  () => [props.studies, props.mode],
  () => {
    loadAnswers();
  },
  { immediate: true }
);
</script>

<style scoped>
.study-card {
  height: 100%;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.study-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.title-block {
  max-width: calc(100% - 120px);
}

.description-wrapper {
  margin-bottom: 1rem;
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
}

.description-truncated {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
}

/* Fallback for non-webkit browsers */
@supports not (-webkit-line-clamp: 3) {
  .description-truncated {
    max-height: 4.5em;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
