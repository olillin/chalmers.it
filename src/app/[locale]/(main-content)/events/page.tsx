import styles from './page.module.scss';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import ContactCard from '@/components/ContactCard/ContactCard';
import ContentPane from '@/components/ContentPane/ContentPane';
import i18nService from '@/services/i18nService';
import LargeCalendar from '@/components/LargeCalendar/LargeCalendar';

export default async function Page(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;

  return (
    <main>
      <ThreePaneLayout
        middle={
          <ContentPane>
            <LargeCalendar locale={locale} />
          </ContentPane>
        }
        right={<ContactCard locale={locale} />}
      />
    </main>
  );
}
