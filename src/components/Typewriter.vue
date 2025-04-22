<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const props = defineProps<{
  text: string;
  speed?: number;
  delay?: number;
}>();

const displayText = ref('');
const isTyping = ref(true);
const isDeleting = ref(false);

const typeWriter = () => {
  let i = 0;
  const text = props.text;
  const speed = props.speed || 100;
  const delay = props.delay || 2000;
  
  isTyping.value = true;
  isDeleting.value = false;
  displayText.value = '';
  
  const typing = () => {
    if (i < text.length) {
      displayText.value += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    } else {
      isTyping.value = false;
      // 等待一段时间后开始删除
      setTimeout(() => {
        isDeleting.value = true;
        deleteText();
      }, delay);
    }
  };
  
  const deleteText = () => {
    if (displayText.value.length > 0) {
      displayText.value = displayText.value.slice(0, -1);
      setTimeout(deleteText, speed);
    } else {
      isDeleting.value = false;
      // 重新开始打字
      setTimeout(typeWriter, 500);
    }
  };
  
  typing();
};

onMounted(() => {
  typeWriter();
});

watch(() => props.text, () => {
  typeWriter();
});
</script>

<template>
  <span class="inline-block">
    {{ displayText }}
    <span v-if="isTyping || isDeleting" class="animate-pulse">|</span>
  </span>
</template> 