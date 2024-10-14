import { VirtualPiano } from '@/components/virtual-piano';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Piano Training App
      </h1>
      <VirtualPiano />
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Virtual Piano</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Practice playing piano notes with our interactive virtual
              keyboard.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Exercises</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Improve your skills with Note recognition and Rhythm exercises.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              View and upload your own music scores in .musicxml and .midi
              formats.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sight Reading</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Practice sight reading with auto-generated scores tailored to your
              skill level.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}