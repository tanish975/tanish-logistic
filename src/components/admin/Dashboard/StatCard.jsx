import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CountUp from 'react-countup';

const StatCard = ({ icon, title, value, change }) => {
  const prefix = value.match(/^[^0-9]*/)?.[0] || '';
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          <CountUp
            start={0}
            end={numericValue}
            duration={2.75}
            separator=","
            prefix={prefix}
            decimals={numericValue % 1 !== 0 ? 2 : 0}
          />
        </div>
        {change && <p className="text-xs text-muted-foreground">{change}</p>}
      </CardContent>
    </Card>
  );
};

export default StatCard;