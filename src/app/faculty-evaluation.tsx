import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, Card, Icon, Page, Pill, PrimaryButton, ProgressBar } from '@/components/ui';
import { useAppState } from '@/context/app-state';
import { evaluationPeriod, facultyToEvaluate, type FacultyToEvaluate } from '@/data/sampleData';
import { formatDate } from '@/format';
import { colors, maxContentWidth, minTouch, radius, spacing } from '@/theme';

const SCALE = [
  { value: 1, label: 'Poor' },
  { value: 2, label: 'Fair' },
  { value: 3, label: 'Good' },
  { value: 4, label: 'Very good' },
  { value: 5, label: 'Excellent' },
];

export default function FacultyEvaluationScreen() {
  const { submittedEvaluations, pendingEvaluations } = useAppState();
  const [active, setActive] = useState<FacultyToEvaluate | null>(null);
  const done = facultyToEvaluate.length - pendingEvaluations;

  return (
    <Page>
      <Card style={styles.intro}>
        <Text style={styles.introTitle}>{evaluationPeriod.term}</Text>
        <Text style={styles.introBody}>
          Rate each instructor before {formatDate(evaluationPeriod.deadline)}. Your answers are anonymous and are
          only shown to the school as a summary.
        </Text>
        <View style={styles.introProgress}>
          <View style={{ flex: 1 }}>
            <ProgressBar
              value={done / facultyToEvaluate.length}
              color={colors.maroon}
              trackColor="rgba(122, 14, 14, 0.12)"
              label="Evaluations completed"
            />
          </View>
          <Text style={styles.introCount}>
            {done} of {facultyToEvaluate.length} done
          </Text>
        </View>
      </Card>

      {facultyToEvaluate.map((f) => {
        const submitted = submittedEvaluations.has(f.id);
        return (
          <Card
            key={f.id}
            onPress={submitted ? undefined : () => setActive(f)}
            accessibilityLabel={`Evaluate ${f.name}, ${f.subjectCode} ${f.subjectTitle}`}
            style={[styles.row, submitted && styles.rowDone]}>
            <Avatar name={f.name} size={42} tone={submitted ? 'success' : 'maroon'} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.name}>{f.name}</Text>
              <Text style={styles.subject} numberOfLines={1}>
                {f.subjectCode} · {f.subjectTitle}
              </Text>
            </View>
            {submitted ? (
              <Pill label="Submitted" tone="success" icon="checkmark" />
            ) : (
              <View style={styles.cta}>
                <Text style={styles.ctaText}>Evaluate</Text>
                <Icon name="chevron-forward" size={16} color={colors.maroon} />
              </View>
            )}
          </Card>
        );
      })}

      <EvaluationForm faculty={active} onClose={() => setActive(null)} />
    </Page>
  );
}

function EvaluationForm({ faculty, onClose }: { faculty: FacultyToEvaluate | null; onClose: () => void }) {
  const { submitEvaluation } = useAppState();
  const insets = useSafeAreaInsets();
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [comment, setComment] = useState('');
  const complete = evaluationPeriod.criteria.every((_, i) => ratings[i]);
  const rated = evaluationPeriod.criteria.filter((_, i) => ratings[i]).length;

  const close = () => {
    setRatings({});
    setComment('');
    onClose();
  };

  return (
    <Modal visible={!!faculty} animationType="slide" onRequestClose={close} presentationStyle="pageSheet">
      <View style={[styles.modal, { paddingTop: insets.top || spacing.lg }]}>
        <View style={styles.modalHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.modalTitle}>{faculty?.name}</Text>
            <Text style={styles.subject}>
              {faculty?.subjectCode} · {faculty?.subjectTitle}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close without submitting"
            onPress={close}
            style={({ pressed }) => [styles.close, pressed && { opacity: 0.6 }]}>
            <Icon name="close" size={26} color={colors.text} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={[styles.modalBody, { paddingBottom: insets.bottom + spacing.xxl }]}>
          <View style={styles.formProgress}>
            <Text style={styles.formProgressText}>
              {rated} of {evaluationPeriod.criteria.length} rated
            </Text>
            <Text style={styles.scaleHint}>1 = Poor, 5 = Excellent</Text>
          </View>
          {evaluationPeriod.criteria.map((c, i) => (
            <View key={c} style={styles.criterion}>
              <Text style={styles.criterionText}>
                {i + 1}. {c}
              </Text>
              <View style={styles.scale} accessibilityRole="radiogroup" accessibilityLabel={c}>
                {SCALE.map((s) => {
                  const on = ratings[i] === s.value;
                  return (
                    <Pressable
                      key={s.value}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: on }}
                      accessibilityLabel={`${s.value}, ${s.label}`}
                      onPress={() => setRatings((r) => ({ ...r, [i]: s.value }))}
                      style={({ pressed }) => [styles.scaleBtn, on && styles.scaleBtnOn, pressed && !on && styles.scaleBtnPressed]}>
                      <Text style={[styles.scaleNum, on && { color: '#fff' }]}>{s.value}</Text>
                      <Text style={[styles.scaleLabel, on && { color: colors.gold }]} numberOfLines={1}>
                        {s.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}

          <Text style={styles.criterionText}>Comments (optional)</Text>
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="What did this instructor do well? What could be better?"
            placeholderTextColor={colors.textMuted}
            multiline
            style={styles.input}
          />

          <PrimaryButton
            label="Submit evaluation"
            disabled={!complete}
            onPress={() => {
              if (faculty) submitEvaluation(faculty.id);
              close();
            }}
          />
          {!complete ? (
            <Text style={styles.scaleHint}>
              Rate {evaluationPeriod.criteria.length - rated} more {evaluationPeriod.criteria.length - rated === 1 ? 'item' : 'items'} to submit.
            </Text>
          ) : null}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  intro: { backgroundColor: colors.goldSoft, borderColor: colors.gold, gap: 6 },
  introTitle: { fontSize: 16, fontWeight: '800', color: colors.maroon },
  introBody: { fontSize: 14, color: colors.text, lineHeight: 20 },
  introProgress: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.xs },
  introCount: { fontSize: 13, fontWeight: '700', color: colors.goldText, fontVariant: ['tabular-nums'] },
  rowDone: { backgroundColor: colors.surfaceMuted },
  close: { width: minTouch, height: minTouch, alignItems: 'center', justifyContent: 'center', marginTop: -10, marginRight: -10 },
  formProgress: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  formProgressText: { fontSize: 13, fontWeight: '700', color: colors.maroon },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  name: { fontSize: 15, fontWeight: '700', color: colors.text },
  subject: { fontSize: 13, color: colors.textMuted },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ctaText: { color: colors.maroon, fontWeight: '700', fontSize: 14 },
  modal: { flex: 1, backgroundColor: colors.background },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.lg,
    width: '100%',
    maxWidth: maxContentWidth,
    alignSelf: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  modalBody: { padding: spacing.lg, gap: spacing.lg, width: '100%', maxWidth: maxContentWidth, alignSelf: 'center' },
  scaleHint: { fontSize: 13, color: colors.textMuted, textAlign: 'center' },
  criterion: { gap: spacing.sm },
  criterionText: { fontSize: 15, fontWeight: '600', color: colors.text },
  scale: { flexDirection: 'row', gap: spacing.sm },
  scaleBtn: {
    flex: 1,
    minHeight: 56,
    paddingVertical: 6,
    gap: 2,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scaleBtnOn: { backgroundColor: colors.maroon, borderColor: colors.maroon },
  scaleBtnPressed: { backgroundColor: colors.maroonSoft },
  scaleNum: { fontSize: 17, fontWeight: '800', color: colors.text },
  scaleLabel: { fontSize: 10, fontWeight: '600', color: colors.textMuted },
  input: {
    minHeight: 100,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 15,
    color: colors.text,
    textAlignVertical: 'top',
  },
});
